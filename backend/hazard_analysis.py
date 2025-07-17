# hazard_analysis.py

import os
import cv2
import google.generativeai as genai

# Configure Gemini API
genai.configure(api_key="AIzaSyAN93wy8SAstfVPA00LuUtZ2amgNaBur1k")

from PIL import Image

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    generation_config=generation_config,
)

prompt = """You are an operator assistant for construction and mining sites.
Analyze this image and determine the possible hazards that is happening for proximity check.

Look for:
People too close to heavy machinery
Workers near dangerous areas or equipment  
Any unsafe distances between people and machines
Equipment that might be too close to each other

Provide a detailed analysis of what you see and any safety concerns."""

def extract_frames(video_path, output_folder, interval_seconds=1):
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return []

    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = frame_count / fps
    extracted_frames = []

    for second in range(0, int(duration), interval_seconds):
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(second * fps))
        ret, frame = cap.read()
        if ret:
            frame_filename = f"frame_{second:04d}.jpg"
            frame_path = os.path.join(output_folder, frame_filename)
            cv2.imwrite(frame_path, frame)
            extracted_frames.append(frame_path)
    cap.release()
    return extracted_frames

def analyze_frames(frame_paths):
    results = []

    for frame_path in frame_paths:
        try:
            with open(frame_path, "rb") as img_file:
                image_data = img_file.read()
            response = model.generate_content([
                prompt,
                {"mime_type": "image/jpeg", "data": image_data}
            ])
            results.append({
                "frame": os.path.basename(frame_path),
                "analysis": response.text
            })
        except Exception as e:
            results.append({
                "frame": os.path.basename(frame_path),
                "analysis": f"Error: {str(e)}"
            })
    return results
