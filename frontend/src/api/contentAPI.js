// import axios from 'axios';

// // Accessing VITE_ prefixed variable from .env
// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
// });

// // Upload a file using multipart/form-data
// export const uploadContent = (file) => {
//   const data = new FormData();
//   data.append('file', file);

//   return API.post('/content/upload', data, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
// };

// // Fetch all available formats
// export const fetchFormats = () => API.get('/formats');
// export const fetchGeneratedContent = () => API.get('/content/generated');









// src/api/contentAPI.js
import axios from 'axios';

// Base API using VITE environment variable
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g. http://localhost:5000/api
});

// ✅ Upload a file using multipart/form-data
export const uploadContent = async (file) => {
  if (!file) throw new Error("No file provided for upload.");

  const formData = new FormData();
  formData.append('file', file); // backend expects field name to be 'file'

  try {
    const response = await API.post('/content/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (err) {
    console.error('❌ Upload failed:', err.response?.data || err.message);
    throw err;
  }
};

// ✅ Upload content from a URL (e.g., YouTube)
export const uploadFromURL = (url) => {
  return API.post('/content/upload-url', { url });
};


// ✅ Get formats (YouTube, Blog, etc.)
export const fetchFormats = () => API.get('/formats');

// ✅ Get all generated content (for results/dashboard)
export const fetchGeneratedContent = () => API.get('/content/generated');
