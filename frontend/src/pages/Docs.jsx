/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function Docs() {
  const docRef = useRef(null);

  // Animate the container when the component mounts
  useEffect(() => {
    gsap.fromTo(
      docRef.current,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#f4eee0] px-4 py-16 flex items-start justify-center">
      <motion.div
        ref={docRef}
        className="w-full max-w-3xl space-y-6"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold border-b pb-2 border-[#e8dcc0]/30">
          📘 Documentation
        </h1>

        {/* Extended Project Description */}
        <p className="text-base sm:text-lg leading-relaxed">
          This AI-powered platform is designed to streamline content repurposing for creators, marketers, podcasters, and educators.
          Whether you're uploading a video, audio file, or article — the system analyzes your input, extracts key metadata, and produces
          high-performing output tailored for different platforms like Instagram, Twitter (X), and blogs.
        </p>

        {/* Quick Summary */}
        <p className="text-base sm:text-lg leading-relaxed">
          Instead of manually writing separate posts or captions for each platform, this tool generates optimized, platform-ready formats
          in seconds — helping you increase reach, engagement, and efficiency.
        </p>

        {/* Features List */}
        <ul className="list-disc space-y-3 ml-5 text-base sm:text-lg">
{/*           <li>Upload video, audio, or text files—or paste a URL.</li> */}
          <li>Auto-detects content type and extracts metadata (title, duration, keywords).</li>
          <li>
            Generates multiple outputs:
            <ul className="list-inside list-disc mt-2 ml-4 space-y-1 text-[#e8dcc0]/90">
              <li>🎬 Instagram Reel Caption + Hashtags</li>
              <li>🧵 Twitter Threads</li>
              <li>✍️ SEO-optimized Blogs</li>
            </ul>
          </li>
          <li>Supports copy, download, and scheduling functionality for each output.</li>
        </ul>


      </motion.div>
    </div>
  );
}
