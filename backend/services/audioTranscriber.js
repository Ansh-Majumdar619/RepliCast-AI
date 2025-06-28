

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
