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
      const res = await fetch('http://localhost:5000/upload/');
      const data = await res.json();
      setFiles(data.files);
    } catch (err) {
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
