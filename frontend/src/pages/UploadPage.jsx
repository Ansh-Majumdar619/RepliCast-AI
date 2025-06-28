/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';

import UploadForm from '../components/UploadForm';
import { uploadContent, uploadFromURL } from '../api/contentAPI';

export default function UploadPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 🌀 loading state for URL uploads

  // 🔄 Animate page on mount
  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
    );
  }, []);

  // 📤 Handle file uploads via UploadForm
  const handleUpload = async (file) => {
    try {
      const res = await uploadContent(file);
      navigate('/results', { state: res.data.result });
    } catch (err) {
      console.error(err);
      setError('Upload failed. Check console.');
    }
  };

  // 🌐 Handle URL upload (with loading animation)
  const handleURL = async (e) => {
    e.preventDefault();
    if (!url.trim()) return setError('Please enter a valid URL');

    setIsLoading(true);
    setError('');

    try {
      const res = await uploadFromURL(url.trim());
      navigate('/results', { state: res.data.result });
    } catch (err) {
      console.error(err);
      setError('URL upload failed. Check console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0e0c12] flex items-center justify-center px-4 py-10"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-[#c8a76f] border border-[#e8dcc0]/20 rounded-3xl shadow-2xl p-8 w-full max-w-2xl space-y-8"
      >
        {/* 📢 Heading */}
        <h1 className="text-3xl sm:text-4xl text-center font-bold text-[#765136] mb-4">
          🎥 Upload Your Content
        </h1>

        {/* 🗂 Upload from file */}
        <UploadForm onUpload={handleUpload} />

        {/* 🔗 Upload from YouTube URL */}
        <motion.form
          onSubmit={handleURL}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="📹 Paste YouTube video URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-black border border-[#e8dcc0]/40 text-[#e8dcc0] placeholder-[#e8dcc0]/60 rounded-md px-4 py-2 focus:outline-none focus:border-[#e8dcc0]"
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold rounded-md cursor-pointer py-2 transition ${
              isLoading
                ? 'bg-[#a1937a] text-black cursor-not-allowed'
                : 'bg-[#e8dcc0] text-black hover:bg-[#60442e] hover:text-[#dfcea9]'
            }`}
          >
            {isLoading ? (
              <span className="flex justify-center items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Uploading...
              </span>
            ) : (
              '⬆️ Upload from URL'
            )}
          </button>
        </motion.form>

        {/* ❌ Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
