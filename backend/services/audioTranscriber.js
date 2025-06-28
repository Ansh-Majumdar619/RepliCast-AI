// import axios from 'axios';
// import fs from 'fs';
// import FormData from 'form-data';
// import dotenv from 'dotenv';

// dotenv.config();

// const ASSEMBLYAI_API = 'https://api.assemblyai.com/v2';
// const API_KEY = process.env.ASSEMBLYAI_API_KEY;

// // ⏳ Delay helper
// const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// // 🔼 Upload audio file to AssemblyAI
// const uploadAudio = async (filePath) => {
//   try {
//     const form = new FormData();
//     form.append('file', fs.createReadStream(filePath));

//     const response = await axios.post(`${ASSEMBLYAI_API}/upload`, form, {
//       headers: {
//         ...form.getHeaders(),
//         authorization: API_KEY,
//       },
//     });

//     console.log('📤 Audio uploaded successfully');
//     return response.data.upload_url;
//   } catch (error) {
//     console.error('❌ Audio upload failed:', error.message);
//     throw error;
//   }
// };

// // 🔠 Start transcription job and poll until complete
// export const transcribeAudio = async (filePath) => {
//   try {
//     // Step 1: Upload file
//     const uploadUrl = await uploadAudio(filePath);

//     // Step 2: Start transcription
//     const transcriptRes = await axios.post(
//       `${ASSEMBLYAI_API}/transcript`,
//       { audio_url: uploadUrl },
//       { headers: { authorization: API_KEY } }
//     );

//     const transcriptId = transcriptRes.data.id;
//     console.log(`📡 Transcription started (ID: ${transcriptId})`);

//     // Step 3: Polling loop
//     let attempts = 0;
//     const maxAttempts = 30;
//     let completed = false;
//     let transcriptText = '';

//     while (!completed && attempts < maxAttempts) {
//       const statusRes = await axios.get(
//         `${ASSEMBLYAI_API}/transcript/${transcriptId}`,
//         { headers: { authorization: API_KEY } }
//       );

//       const status = statusRes.data.status;

//       if (status === 'completed') {
//         completed = true;
//         transcriptText = statusRes.data.text;
//         console.log('✅ Transcription complete');
//       } else if (status === 'error') {
//         throw new Error(`❌ AssemblyAI Error: ${statusRes.data.error}`);
//       } else {
//         console.log(`⏳ Polling status: ${status}...`);
//         await delay(2000);
//         attempts++;
//       }
//     }

//     if (!completed) {
//       throw new Error('❌ Transcription timed out after 30 attempts (~60s)');
//     }

//     return transcriptText;
//   } catch (err) {
//     console.error('❌ Transcription failed:', err.message);
//     throw err;
//   }
// };












import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();
const API = 'https://api.assemblyai.com/v2';
const AUTH = { authorization: process.env.ASSEMBLYAI_API_KEY };
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// 🔼 Upload audio file
const uploadAudio = async (filePath) => {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const { data } = await axios.post(`${API}/upload`, form, {
      headers: { ...form.getHeaders(), ...AUTH },
    });

    console.log('📤 Uploaded audio');
    return data.upload_url;
  } catch (err) {
    console.error('❌ Upload failed:', err.message);
    throw err;
  }
};

// 🔠 Transcribe audio and poll until complete
export const transcribeAudio = async (filePath) => {
  try {
    const uploadUrl = await uploadAudio(filePath);

    const { data: { id } } = await axios.post(`${API}/transcript`, { audio_url: uploadUrl }, { headers: AUTH });
    console.log(`📡 Transcription started (ID: ${id})`);

    for (let i = 0; i < 30; i++) {
      const { data } = await axios.get(`${API}/transcript/${id}`, { headers: AUTH });

      if (data.status === 'completed') {
        console.log('✅ Transcription complete');
        return data.text;
      }

      if (data.status === 'error') {
        throw new Error(`❌ AssemblyAI Error: ${data.error}`);
      }

      console.log(`⏳ Polling... (${data.status})`);
      await delay(2000);
    }

    throw new Error('❌ Transcription timed out after 30 attempts (~60s)');
  } catch (err) {
    console.error('❌ Transcription failed:', err.message);
    throw err;
  }
};
