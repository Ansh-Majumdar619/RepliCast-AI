/* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Menu, X } from 'lucide-react';

// export default function Navbar() {
//   const { pathname } = useLocation();
//   const [isOpen, setIsOpen] = useState(false);
//   const [showNavbar, setShowNavbar] = useState(true);
//   const [lastScrollY, setLastScrollY] = useState(0);

//   const items = ['/', '/upload', '/results', '/dashboard', '/docs'];
//   const names = ['Home', 'Upload', 'Results', 'Dashboard', 'Docs'];

//   // 🔄 Scroll logic to show/hide navbar
//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
//       setShowNavbar(currentScrollY < lastScrollY || currentScrollY < 80);
//       setLastScrollY(currentScrollY);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, [lastScrollY]);

//   return (
//     <>
//       {/* 🧊 Sticky Pill Glass Navbar */}
//       <AnimatePresence>
//         {showNavbar && (
//           <motion.nav
//             initial={{ y: -100, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             exit={{ y: -100, opacity: 0 }}
//             transition={{ duration: 0.4 }}
//             className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 w-fit px-4"
//           >
//             <div className="flex items-center justify-between w-full max-w-[95vw] rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-md px-6 py-3 space-x-6">
//               {/* 🚀 Logo */}
//               <div className="hidden sm:block text-[#f4eee0] font-semibold text-lg whitespace-nowrap">
//                 🚀 RepliCast
//               </div>

//               {/* 🖥 Desktop Nav Links */}
//               <div className="hidden md:flex items-center space-x-6">
//                 {names.map((name, idx) => {
//                   const to = items[idx];
//                   const isActive = pathname === to;
//                   return (
//                     <Link
//                       key={to}
//                       to={to}
//                       className={`relative font-medium ${
//                         isActive ? 'text-[#f4eee0]' : 'text-[#f4eee0]'
//                       } hover:text-[#bd9152] transition-colors`}
//                     >
//                       {name}
//                       {isActive && (
//                         <motion.div
//                           layoutId="underline"
//                           className="absolute bottom-[-6px] w-full h-[2px] bg-[#765136] rounded"
//                         />
//                       )}
//                     </Link>
//                   );
//                 })}
//               </div>

//               {/* 📱 Hamburger on Right (Mobile) */}
//               <div className="md:hidden ml-auto">
//                 <button
//                   onClick={() => setIsOpen(!isOpen)}
//                   className="text-[#f4eee0] focus:outline-none"
//                 >
//                   {isOpen ? <X size={24} /> : <Menu size={24} />}
//                 </button>
//               </div>
//             </div>
//           </motion.nav>
//         )}
//       </AnimatePresence>

//       {/* 📱 Mobile Dropdown Menu */}
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: 'auto', opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             className="absolute top-[72px] left-1/2 transform -translate-x-1/2 z-30 w-[90vw] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 space-y-4"
//           >
//             {names.map((name, idx) => {
//               const to = items[idx];
//               const isActive = pathname === to;
//               return (
//                 <Link
//                   key={to}
//                   to={to}
//                   onClick={() => setIsOpen(false)}
//                   className={`block text-base font-medium ${
//                     isActive ? 'text-[#f4eee0]' : 'text-[#f4eee0]'
//                   } hover:text-[#bd9152] transition-colors`}
//                 >
//                   {name}
//                 </Link>
//               );
//             })}
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }









import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const routes = [
    { path: '/', label: 'Home' },
    { path: '/upload', label: 'Upload' },
    { path: '/results', label: 'Results' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/docs', label: 'Docs' },
  ];

  // 🧭 Auto-hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShowNavbar(y < lastScrollY || y < 80);
      setLastScrollY(y);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* 🚀 Floating Navbar */}
      <AnimatePresence>
        {showNavbar && (
          <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-fit px-4"
          >
            <div className="flex items-center justify-between w-full max-w-[95vw] px-6 py-3 space-x-6 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-md">
              
              {/* 🔹 Logo */}
              <span className="hidden sm:block text-[#f4eee0] font-semibold text-lg">🚀 RepliCast</span>

              {/* 🖥 Desktop Links */}
              <div className="hidden lg:flex items-center space-x-6">
                {routes.map(({ path, label }) => {
                  const active = pathname === path;
                  return (
                    <Link
                      key={path}
                      to={path}
                      className={`relative font-medium text-[#f4eee0] hover:text-[#bd9152] transition-colors`}
                    >
                      {label}
                      {active && (
                        <motion.div
                          layoutId="underline"
                          className="absolute bottom-[-6px] w-full h-[2px] bg-[#765136] rounded"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* 📱 Hamburger Menu (shows on md & sm screens) */}
              <div className="lg:hidden ml-auto">
                <button onClick={() => setIsOpen(!isOpen)} className="text-[#f4eee0] focus:outline-none">
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* 📱 Dropdown Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-[72px] left-1/2 -translate-x-1/2 z-30 w-[90vw] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 space-y-4"
          >
            {routes.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`block text-base font-medium text-[#f4eee0] hover:text-[#bd9152] transition-colors`}
              >
                {label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
