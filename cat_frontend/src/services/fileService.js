import axios from 'axios'

export const uploadFile = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', ''); // or some optional description if needed

  return axios.post('http://localhost:5000/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      // Add authentication header if needed:
      // 'Authorization': Bearer ${yourToken}
    },
    onUploadProgress,
  });
};