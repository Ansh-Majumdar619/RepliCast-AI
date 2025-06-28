/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */


import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function FormatCard({ data }) {
  // Return nothing if no data is passed
  if (!data) return null;

  // State for managing editor modal
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  // Ref for GSAP animation
  const cardRef = useRef(null);

  // On mount: animate card entrance
  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
    );
  }, []);

  // Destructuring incoming data
  const { type, caption, blog, thread, seo, hashtags, output } = data;

  // Map to show the type-specific title
  const titleMap = {
    video: '🎬 Instagram Reel / Video Output',
    audio: '🎧 Podcast Summary + Twitter Thread',
    text: '✍️ Blog Post',
  };

  // Backend file base URL (e.g., for video/audio)
  const baseURL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || '';

  // Open editing modal with content
  const openEditor = (label, content) => {
    setEditLabel(label);
    setEditedContent(content);
    setEditing(true);
  };

  // Copy text utility
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    // Container: fullscreen height, gradient background, center the content
    <div className="min-h-screen w-[85vw] bg-black  flex justify-center items-center overflow-x-hidden px-4">

      {/* Animated Card Container */}
      <motion.div
        ref={cardRef}
        className="w-full max-w-[1300px] h-[95vh] bg-[#060408] 
               px-6 py-8 rounded-2xl shadow-2xl overflow-y-auto scroll-smooth 
               flex flex-col space-y-6 justify-start items-start scrollbar-hide border"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Dynamic Title */}
        <h3 className="text-3xl sm:text-2xl font-bold  text-[#e8dcc0]">
          {titleMap[type]}
        </h3>

        {/* Blog + SEO Output */}
        {blog && (
          <>
            <p className="text-[#e8dcc0] text-2xl whitespace-pre-wrap  sm:text-base">{blog}</p>
            {seo && (
              <div className=" text-xl text-[#e8dcc0] space-y-1">
                <p><strong>🔍 SEO Title:</strong> {seo.title || seo}</p>
                <p><strong>📝 Description:</strong> {seo.description || ''}</p>
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              <button onClick={() => copyToClipboard(blog)} className="btn-primary bg-[#92643c] text-black cursor-pointer hover:bg-[#bda48f]">📋 Copy Blog</button>
              <button onClick={() => openEditor('Blog', blog)} className="btn-secondary bg-[#c8a76f] text-black cursor-pointer hover:bg[#c8a76g] ">✏️ Edit Blog</button>
            </div>
          </>
        )}

        {/* Twitter Thread */}
        {thread && (
          <>
            <h4 className="text-2xl font-semibold text-[#e8dcc0]">🧵 Twitter Thread</h4>
            <pre className="text-[#e8dcc0] whitespace-pre-wrap text-xl sm:text-base">{thread}</pre>
            <div className="flex flex-wrap gap-2 mt-2">
              <button onClick={() => copyToClipboard(thread)} className="btn-primary">📋 Copy Thread</button>
              <button onClick={() => openEditor('Thread', thread)} className="btn-secondary">✏️ Edit Thread</button>
            </div>
          </>
        )}

        {/* Instagram Caption */}
        {caption && (
          <>
            <h4 className="text-lg font-semibold text-[#e8dcc0]">🎬 Instagram Caption</h4>
            <p className="text-[#e8dcc0] text-xl sm:text-base">{caption}</p>
            <button onClick={() => copyToClipboard(caption)} className="btn-primary mt-2">📋 Copy Caption</button>
          </>
        )}

        {/* Hashtags */}
        {/* Hashtags */}
        {hashtags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 w-full">
            {hashtags.map((tag, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-800 px-3 py-1 text-sm rounded shadow-sm 
                   break-words break-all overflow-hidden max-w-full"
                style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
              >
                #{tag.replace(/^#/, '')}
              </span>
            ))}
          </div>
        )}


        {/* Video Preview */}
        {type === 'video' && output && (
          <video controls className="w-full mt-4 rounded-md shadow-lg">
            <source src={`${baseURL}/${output}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Audio Preview */}
        {type === 'audio' && output && (
          <audio controls className="w-full mt-4 rounded-md">
            <source src={`${baseURL}/${output}`} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}

        {/* File Download Link */}
        {output && (
          <a
            href={`${baseURL}/${output}`}
            download
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-4 rounded-lg transition"
          >
            ⬇️ Download Output
          </a>
        )}

        {/* Schedule Input */}
        <div className="w-full mt-4">
          <label className="block text-sm font-medium  text-amber-100 mb-1">📅 Schedule Post</label>
          <input
            type="datetime-local"
            onChange={(e) => setScheduleTime(e.target.value)}
            className="border px-3 py-2 rounded w-full text-black bg-amber-100 text-sm"
          />
          <button
            onClick={() => alert(`Scheduled for: ${scheduleTime}`)}
            className="bg-[#92643c] text-white cursor-pointer mt-3 px-4 py-2 rounded hover:bg-[#e1b996] hover:text-black transition"
          >
            ✔️ Confirm Schedule
          </button>
        </div>

        {/* Editor Modal */}
        {editing && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-2xl max-w-2xl w-full shadow-2xl space-y-4">
              <h2 className="text-xl font-bold text-gray-800">Edit {editLabel}</h2>
              <textarea
                rows={10}
                className="w-full border p-3 rounded-md"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(editedContent);
                    alert('Edited content copied!');
                    setEditing(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Copy & Close
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
