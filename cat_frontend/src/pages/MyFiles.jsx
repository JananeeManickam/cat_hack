import { useEffect, useState } from 'react';
import DashboardLayout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import '../styles/MyFiles.css';

export default function MyFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch('http://localhost:5000/files');
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      console.error('Error fetching files:', err);
      setFiles([]); // Make sure files is always an array
    } finally {
      setLoading(false);
    }
  };

  // Download handler for a file
  const handleDownload = async (file) => {
    try {
      // Fetch full content for the file (if needed for the API)
      const contentRes = await fetch(`http://localhost:5000/get-file-content/${file.id}`);
      const contentData = await contentRes.json();

      // POST to download endpoint
      const response = await fetch(`http://localhost:5000/edit-file-download/${file.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: file.filename,
          contents: contentData.content
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to download the file');
      }

      // Get the file blob
      const blob = await response.blob();

      // Try to get filename from Content-Disposition header
      let downloadFilename = `edited_${file.filename}`;
      const disposition = response.headers.get('Content-Disposition');
      if (disposition && disposition.includes('filename=')) {
        downloadFilename = disposition.split('filename=')[1].replace(/"/g, '');
      }

      // Create temporary link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Failed to download file.');
    }
  };

  return (
    <DashboardLayout>
      <div className="myfiles-container">
        <h2>My Uploaded Files</h2>
        {loading ? (
          <p>Loading files...</p>
        ) : files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          <div className="files-list">
            {files.map(file => (
              <div className="file-card" key={file.id}>
                <div className="file-info">
                  <h4>{file.filename}</h4>
                  <p><strong>Size:</strong> {(file.size / 1024).toFixed(2)} KB</p>
                  <p><strong>Uploaded:</strong> {new Date(file.uploaded_at).toLocaleString()}</p>
                  <p className="file-preview">{file.content_preview}</p>
                </div>
                <div className="file-actions">
                  <button className="edit-button" onClick={() => navigate(`/edit/${file.id}`)}>
                    Edit
                  </button>
                  <button className="edit-button" onClick={() => handleDownload(file)}>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}