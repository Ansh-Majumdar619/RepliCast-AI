/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="w-full bg-black text-[#e8dcc0] py-8 px-4 flex flex-col items-center justify-center "
    >
      {/* Logo or Name */}
      <h2 className="text-xl md:text-2xl font-semibold mb-2">🚀 RepliCast AI</h2>

      {/* Social Icons */}
      <div className="flex space-x-6 mt-2 mb-4">
        <a
          href="https://github.com/Ansh-Majumdar619"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition duration-300"
        >
          <FaGithub size={20} />
        </a>
        <a
          href="https://www.linkedin.com/in/ansh-majumdar"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition duration-300"
        >
          <FaLinkedin size={20} />
        </a>
        <a
          href="https://x.com/anshmajumdar619"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition duration-300"
        >
          <FaTwitter size={20} />
        </a>
      </div>

      {/* Links or Info */}
      <p className="text-sm text-center opacity-70 max-w-md">
        © {new Date().getFullYear()} RepliCast AI. All rights reserved. Designed for modern content automation workflows.
      </p>
    </motion.footer>
  );
};

export default Footer;
