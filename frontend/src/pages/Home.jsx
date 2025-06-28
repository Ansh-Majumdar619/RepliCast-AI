/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useNavigate } from 'react-router-dom';
import TextPressure from '../ui/TextPressure';
import CardSwap, { Card } from '../ui/CardSwap';
import Masonry from '../ui/Masonry';

export default function Home() {
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);
  const [showContent, setShowContent] = useState(false);

  // Image items for Masonry layout
  const items = [
    { id: "1", img: "https://images.unsplash.com/photo-1674027444485-cec3da58eef4?q=80&w=1332", url: "#", height: 400 },
    { id: "2", img: "https://images.unsplash.com/photo-1716637644831-e046c73be197?q=80&w=687", url: "#", height: 300 },
    { id: "3", img: "https://images.unsplash.com/photo-1680783954745-3249be59e527?q=80&w=764", url: "#", height: 450 },
    { id: "4", img: "https://images.unsplash.com/photo-1688678991304-ec82060848ea?q=80&w=1932", url: "#", height: 500 },
    { id: "5", img: "https://plus.unsplash.com/premium_photo-1685224149901-b395deec7aac?q=80&w=1170", url: "#", height: 350 },
    { id: "6", img: "https://plus.unsplash.com/premium_photo-1683936164203-b8b814f2e3a6?q=80&w=784", url: "#", height: 400 },
    { id: "7", img: "https://images.unsplash.com/photo-1687826056231-5156e94758eb?q=80&w=735", url: "#", height: 420 },
    { id: "8", img: "https://plus.unsplash.com/premium_photo-1684979564941-dbf8664a68fc?q=80&w=748", url: "#", height: 500 },
    { id: "9", img: "https://plus.unsplash.com/premium_photo-1683540450469-bacd12a1843f?q=80&w=1332", url: "#", height: 420 },
    { id: "10", img: "https://images.unsplash.com/photo-1567861911437-538298e4232c?q=80&w=764", url: "#", height: 420 },
    { id: "11", img: "https://images.unsplash.com/photo-1554177255-61502b352de3?q=80&w=1170", url: "#", height: 420 },
    { id: "12", img: "https://plus.unsplash.com/premium_photo-1681487966346-cb4a0c7a2a72?q=80&w=880", url: "#", height: 420 },
  ];


  // Animate heading/subheading on mount
  useEffect(() => {
    setShowContent(true);
    const timer = setTimeout(() => {
      gsap.fromTo(headingRef.current, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' });
      gsap.fromTo(subheadingRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, delay: 0.5, duration: 1, ease: 'power3.out' });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="relative w-full min-h-screen bg-black text-[#dfcea9] flex flex-col items-center overflow-x-hidden scrollbar-hide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Hello Text Animation */}
      <div className="w-full mt-40 mb-6 flex justify-center relative z-10">
        <TextPressure
          text="Hello!"
          textColor="#e8dcc0"
          italic
          width
          weight
          minFontSize={40}
          className="text-center w-full"
        />
      </div>

      {/* Main Content */}
      {showContent && (
        <div className="w-full max-w-5xl text-center px-4 z-10">
          {/* Animated Heading */}
          <h1 ref={headingRef} className="text-4xl md:text-6xl font-extrabold mb-6 tracking-wide">
            Automate Your Content Repurposing
          </h1>

          {/* Subheading with animation */}
          <p ref={subheadingRef} className="text-[#765136] text-md md:text-xl mb-10 leading-relaxed">
            Save hours of manual work by transforming a single piece of content into multiple formats —
            blogs, social posts, audio, videos, carousels, newsletters, and more. It's fast, intelligent,
            and designed to multiply your content's reach.
          </p>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/upload')}
            className="bg-[#dfcea9] text-black font-semibold px-8 py-4 rounded-2xl cursor-pointer shadow-lg hover:bg-[#e9dcbb] transition-all"
          >
            Get Started
          </motion.button>

          {/* Animated Card Section */}
          <div className="w-full mt-20 mb-24 px-2 sm:px-4 md:px-12">
            <div className="w-full h-[70vh] bg-[#060010] border border-[#e8dcc0] rounded-xl overflow-hidden relative flex items-center justify-end">
              <h2 className="absolute top-4 left-4 text-2xl font-semibold z-20">Content Tools</h2>
              <div className="w-[95%] h-full relative">
                <CardSwap cardDistance={60} verticalDistance={70} delay={5000} pauseOnHover={false}>
                  {[
                    { title: "AI Writer", img: "/images/ai1.jpg" },
                    { title: "Time Saver", img: "/images/retro.jpg" },
                    { title: "Content Scheduler", img: "/images/content.jpg" },
                  ].map(({ title, img }, i) => (
                    <Card key={i}>
                      <div className="w-full h-full p-4 flex flex-col bg-black text-[#e8dcc0] rounded-xl">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-center">{title}</h3>
                        {/* 🔹 Consistent separator line */}
                        <div className="w-full h-[2px] bg-white mb-4 opacity-60" />

                        {/* 🔹 Ensuring image respects layout */}
                        <div className="flex-1 w-full overflow-hidden rounded-lg">
                          <img
                            src={img}
                            alt={title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </CardSwap>
              </div>
            </div>
          </div>


          {/* Masonry Image Section */}
          <div className="max-w-screen-lg w-full bg-[#060010]">
            <Masonry
              items={items}
              ease="power3.out"
              duration={0.6}
              stagger={0.05}
              animateFrom="bottom"
              scaleOnHover
              hoverScale={0.95}
              blurToFocus
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
