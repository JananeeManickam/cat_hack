import { useState } from 'react';
import '../styles/UploadForm.css';
import { FaTimes } from 'react-icons/fa';

export default function UploadForm() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
    setProgress(0);
  };

  const handleRemove = (indexToRemove) => {
    setFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return alert('Please select at least one file');

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));

    try {
      setUploading(true);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://localhost:5000/upload');

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        setUploading(false);
        if (xhr.status === 200) {
          alert('Files uploaded successfully!');
          setFiles([]);
          setProgress(0);
        } else {
          alert('Upload failed!');
          console.error(xhr.responseText);
        }
      };

      xhr.onerror = () => {
        setUploading(false);
        alert('Upload failed. Please check your connection or server.');
      };

      xhr.send(formData);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Unexpected error occurred!');
      setUploading(false);
    }
  };

  return (
    <>
      <form className="upload-form" onSubmit={handleSubmit}>
        <label className="upload-button">
          <input type="file" multiple hidden onChange={handleChange} />
          Choose Files
        </label>
        <button type="submit" className="upload-button" disabled={files.length === 0 || uploading}>
          {uploading ? 'Uploading...' : 'Upload All'}
        </button>
      </form>

      <div className="file-preview-list">
        {files.map((file, index) => (
          <div className="file-preview-card" key={index}>
            <FaTimes className="remove-icon" onClick={() => handleRemove(index)} />
            <p>{file.name}</p>
          </div>
        ))}
      </div>

      {progress > 0 && uploading && (
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}
    </>
  );
}
