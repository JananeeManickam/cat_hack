from flask import Flask, request, jsonify, send_file
from utils import aiprocess, generate_brief_from_file, edit_pdf
import os

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    files = request.files.getlist('files')
    paths = []

    for file in files:
        filename = file.filename
        path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(path)
        paths.append(path)

    return jsonify({"message": "Files uploaded", "paths": paths})

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
    file = request.files.get("file")
    if not file:
        return {"error": "No file provided"}, 400

    modified_pdf = edit_pdf(file)
    return send_file(modified_pdf, download_name="modified.pdf", as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
