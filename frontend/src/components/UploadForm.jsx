/* eslint-disable no-unused-vars */
// import React, { useState, useRef, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import gsap from 'gsap';

// export default function UploadForm({ onUpload }) {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const formRef = useRef(null);

//   // GSAP animation on mount
//   useEffect(() => {
//     gsap.fromTo(
//       formRef.current,
//       { opacity: 0, y: 50 },
//       { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
//     );
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (file) {
//       setLoading(true);
//       await onUpload(file);
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       ref={formRef}
//       className="w-full bg-[#0e0e0e] border border-[#dfcea9]/30 rounded-2xl p-6 sm:p-8 flex flex-col items-center space-y-6 shadow-lg"
//     >
//       {/* File Input */}
//       <input
//         type="file"
//         accept="audio/*,video/*,text/plain"
//         className="hidden"
//         id="fileInput"
//         onChange={(e) => setFile(e.target.files[0])}
//       />

//       <label
//         htmlFor="fileInput"
//         className="w-full text-center border-2 border-dashed border-[#dfcea9]/40 rounded-xl p-6 text-[#dfcea9] cursor-pointer hover:border-[#dfcea9]/70 transition-colors"
//       >
//         {file ? file.name : '📂 Click to choose a file (txt, mp3, wav, mp4)'}
//       </label>

//       {/* Submit Button or Loader */}
//       {loading ? (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3 }}
//           className="flex items-center justify-center"
//         >
//           <svg
//             className="animate-spin h-8 w-8 text-[#dfcea9]"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 24 24"
//           >
//             <circle
//               className="opacity-30"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="#dfcea9"
//               strokeWidth="4"
//             />
//             <path
//               className="opacity-70"
//               fill="#dfcea9"
//               d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//             />
//           </svg>
//         </motion.div>
//       ) : (
//         <motion.button
//           type="submit"
//           whileTap={{ scale: 0.95 }}
//           className="bg-[#dfcea9] text-black font-semibold px-8 cursor-pointer py-2 rounded-lg hover:bg-[#af7d47] transition"
//         >
//           🚀 Upload & Repurpose
//         </motion.button>
//       )}
//     </form>
//   );
// }








import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

export default function UploadForm({ onUpload }) {
  const [file, setFile] = useState(null);       // Stores selected file
  const [loading, setLoading] = useState(false); // Controls loader
  const formRef = useRef(null);                 // Ref for GSAP animation

  // 🚀 Animate form on mount
  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
  }, []);

  // 📤 Handle file upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    await onUpload(file);   // Calls parent function
    setLoading(false);
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="w-full bg-[#0e0e0e] border border-[#dfcea9]/30 rounded-2xl p-6 sm:p-8 flex flex-col items-center space-y-6 shadow-lg"
    >
      {/* 🔎 Hidden file input */}
      <input
        id="fileInput"
        type="file"
        accept="audio/*,video/*,text/plain"
        className="hidden"
        onChange={(e) => setFile(e.target.files[0])}
      />

      {/* 📁 File Upload Display */}
      <label
        htmlFor="fileInput"
        className="w-full text-center border-2 border-dashed border-[#dfcea9]/40 rounded-xl p-6 text-[#dfcea9] cursor-pointer hover:border-[#dfcea9]/70 transition-colors"
      >
        {file ? file.name : '📂 Click to choose a file (txt, mp3, wav, mp4)'}
      </label>

      {/* ⏳ Show loading or submit button */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center"
        >
          {/* 🔄 Spinner */}
          <svg
            className="animate-spin h-6 w-6 text-[#dfcea9]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-30" cx="12" cy="12" r="10" stroke="#dfcea9" strokeWidth="4" />
            <path
              className="opacity-70"
              fill="#dfcea9"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </motion.div>
      ) : (
        // ✅ Upload Button
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="bg-[#dfcea9] text-black font-semibold cursor-pointer px-8 py-2 rounded-lg hover:bg-[#af7d47] transition"
        >
          🚀 Upload & Repurpose
        </motion.button>
      )}
    </form>
  );
}
