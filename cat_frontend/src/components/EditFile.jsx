import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EditFile.css'; 

export default function EditFilePage() {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const [fileData, setFileData] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/upload/${fileId}/`)
      .then(res => res.json())
      .then(data => {
        setFileData(data);
        setContent(data.full_content);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching file:', err);
        setLoading(false);
      });
  }, [fileId]);

  const handleSave = async () => {
  try {
    const response = await fetch(`http://localhost:8000/upload/${fileId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control' : 'no-cache'
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Failed to save the file');
    }

    const result = await response.json();
    alert('File updated successfully!');

    // ✅ Redirect to MyFiles page
    navigate('/my_files');
  } catch (err) {
    console.error('Error updating file:', err);
    alert('Failed to save file.');
  }
};



  if (loading) return <p>Loading...</p>;

  return (
    <div className="editfile-container">
      <h2>Edit: {fileData?.filename}</h2>
      <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            cols={80}
            className="edit-textarea"
            />
      <div className="button-group">
        <button className="save-button" onClick={handleSave}>Save</button>
        <button className="save-button" onClick={() => navigate('/my_files')}>Cancel</button>
      </div>
    </div>
  );
}
