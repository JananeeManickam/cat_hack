from utils import aiprocess, generate_brief_from_file, edit_pdf, search_google
import os
from flask import Flask, request, jsonify, send_file
import pymysql
import io
import os
from docx import Document
import fitz  # PyMuPDF
import PyPDF2
import requests
from bs4 import BeautifulSoup
from serpapi import GoogleSearch
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.chains import RetrievalQA
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "aldina123",
    "database": "cat"
}

GOOGLE_API_KEY = "AIzaSyBDidg9orPvjjQfMz6n1tNx8RWgLjEipeQ"
SERP_API_KEY = "dad8d20aacff98df37793a921fe61fad4ddadfc0d2714150c739529c8b0e3c2c"

@app.route('/upload', methods=['POST'])
def upload_file():
    files = request.files.getlist('files')
    if not files:
        return jsonify({"error": "No files uploaded"}), 400

    paths = []
    uploaded_db_info = []
    conn = None
    cursor = None

    try:
        conn = pymysql.connect(**db_config)
        cursor = conn.cursor()

        for file in files:
            if file and file.filename:
                filename = file.filename

                # 1. Save to disk
                path = os.path.join(UPLOAD_FOLDER, filename)
                file.seek(0)
                file.save(path)
                paths.append(path)

                # 2. Save to database
                file.seek(0)
                content = file.read()
                insert_query = "INSERT INTO files (filename, content) VALUES (%s, %s)"
                cursor.execute(insert_query, (filename, content))
                conn.commit()
                file_id = cursor.lastrowid

                uploaded_db_info.append({
                    "filename": filename,
                    "file_id": file_id
                })

        return jsonify({
            "message": f"{len(paths)} files uploaded",
            "paths": paths,
            "db_records": uploaded_db_info
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route('/brief', methods=['POST'])
def brief():
    file_path = request.json.get('file_path')
    if not file_path:
        return jsonify({"error": "file_path required"}), 400
    summary = generate_brief_from_file(file_path)
    return jsonify({"summary": summary})

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    file_paths = data.get("file_paths", [])
    question = data.get("question", "")
    if not file_paths or not question:
        return jsonify({"error": "Missing file_paths or question"}), 400
    answer = aiprocess(file_paths, question)
    return jsonify({"answer": answer})

@app.route('/edit-pdf', methods=['POST'])
def edit():
    file_id = request.form.get("file_id")
    file = request.files.get("file")

    if not file_id:
        return jsonify({"error": "Missing file_id"}), 400
    if not file:
        return jsonify({"error": "No file provided"}), 400

    try:
        file_id = int(file_id)
    except ValueError:
        return jsonify({"error": "Invalid file_id"}), 400

    
    modified_pdf = edit_pdf(file)

    
    try:
        conn = pymysql.connect(**db_config)
        cursor = conn.cursor()
        modified_pdf.seek(0)
        content = modified_pdf.read()
        update_query = "UPDATE files SET filename = %s, content = %s WHERE id = %s"
        new_filename = f"edited_{file.filename}"
        cursor.execute(update_query, (new_filename, content, file_id))
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({"error": "No file found with given file_id"}), 404

    except Exception as e:
        return jsonify({"error": "Failed to update DB", "db_error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

    modified_pdf.seek(0)
    return send_file(modified_pdf, download_name="modified.pdf", as_attachment=True)


@app.route('/get-file-content/<int:file_id>', methods=['GET'])
def get_file_content(file_id):
    conn = None
    cursor = None

    try:
        conn = pymysql.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT filename, content FROM files WHERE id = %s", (file_id,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "File not found"}), 404

        filename, content = result
        ext = os.path.splitext(filename)[1].lower()
        temp_path = f"temp_{file_id}{ext}"

        
        with open(temp_path, "wb") as f:
            f.write(content)

        
        if ext == ".pdf":
            doc = fitz.open(temp_path)
            text = "".join(page.get_text() for page in doc)
            doc.close()

        elif ext == ".docx":
            doc = Document(temp_path)
            text = "\n".join(para.text for para in doc.paragraphs)

        elif ext == ".txt":
            with open(temp_path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()

        else:
            os.remove(temp_path)
            return jsonify({"filename": filename, "message": f"Unsupported file type: {ext}"}), 415

        os.remove(temp_path)

        return jsonify({
            "file_id": file_id,
            "filename": filename,
            "content": text
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
@app.route('/websearch', methods=['POST'])
def web_search():
    data = request.json
    query = data.get("query")

    if not query:
        return jsonify({"error": "Query is required"}), 400

    try:
        # Step 1: Get search result links using utils function
        links = search_google(query)

        # Step 2: Scrape content from each link
        snippets = []
        headers = {"User-Agent": "Mozilla/5.0"}

        for url in links[:5]:  # Limit to top 5 for performance
            try:
                response = requests.get(url, headers=headers, timeout=10)
                soup = BeautifulSoup(response.text, "html.parser")

                # Extract visible paragraph texts
                text = " ".join(p.text.strip() for p in soup.find_all("p") if p.text.strip())
                snippet = text[:1000] + "..." if len(text) > 1000 else text

                snippets.append({
                    "url": url,
                    "snippet": snippet
                })
            except Exception as e:
                snippets.append({
                    "url": url,
                    "snippet": f"Failed to fetch content: {str(e)}"
                })

        return jsonify({
            "query": query,
            "results": snippets
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/files', methods=['GET'])
def get_all_files():
    conn = None
    cursor = None

    try:
        conn = pymysql.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("SELECT id, filename FROM files")
        results = cursor.fetchall()

        files = [{"id": row[0], "filename": row[1]} for row in results]

        return jsonify({
            "count": len(files),
            "files": files
        }), 200

    except Exception as e:
        print("Error in /files:", e)
        return jsonify({"error": str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == '__main__':
    app.run(debug=True)
