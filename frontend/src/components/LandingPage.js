import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();

  const handleUpload = async () => {
    const formData = new FormData();
    for (const file of files) {
      formData.append('files', file);
    }
    
    try {
      const res = await axios.post('http://localhost:8085/api/v1/revenue/upload/files', formData);
      console.log(res.data.message);
      navigate('/dashboard'); // redirect to dashboard
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  return (
    <div>
      <h2>📁 Upload your JSON files to begin</h2>
      <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} />
      <button onClick={handleUpload} style={{ marginLeft: '10px' }}>
        Upload & Proceed
      </button>
    </div>
  );
};

export default LandingPage;