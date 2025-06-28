/* eslint-disable no-unused-vars */
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollSmoother from 'gsap/ScrollSmoother';

const SmoothExperience = ({ children }) => {
  const smootherRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    // ✅ Destroy if already exists
    if (ScrollSmoother.get()) {
      ScrollSmoother.get().kill();
    }

    smootherRef.current = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.2,
      effects: true,
    });

    return () => {
      smootherRef.current && smootherRef.current.kill();
    };
  }, []);

  return (
    <div id="smooth-wrapper" className="fixed top-0 left-0 w-full h-full overflow-hidden z-0">
      <CursorFollower />
      <div id="smooth-content" className="relative min-h-screen">
        {children}
      </div>
    </div>
  );
};

const CursorFollower = () => {
  const cursorRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    const move = () => {
      pos.current.x = lerp(pos.current.x, mouse.current.x, 0.15);
      pos.current.y = lerp(pos.current.y, mouse.current.y, 0.15);

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x - 20}px, ${pos.current.y - 20}px, 0)`;
      }

      requestAnimationFrame(move);
    };

    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const addHoverEffect = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform += ' scale(2)';
        cursorRef.current.style.background = 'rgba(255, 255, 255, 0.4)';
      }
    };

    const removeHoverEffect = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x - 20}px, ${pos.current.y - 20}px, 0)`;
        cursorRef.current.style.background = 'rgba(255, 255, 255, 0.15)';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.querySelectorAll('button, a, input, textarea, .cursor-hover').forEach((el) => {
      el.addEventListener('mouseover', addHoverEffect);
      el.addEventListener('mouseout', removeHoverEffect);
    });

    move(); // start animation loop

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.querySelectorAll('button, a, input, textarea, .cursor-hover').forEach((el) => {
        el.removeEventListener('mouseover', addHoverEffect);
        el.removeEventListener('mouseout', removeHoverEffect);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: '#dfcea9',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 0 8px rgba(255,255,255,0.1)',
        mixBlendMode: 'difference',
        transition: 'all 0.3s ease',
      }}
    />
  );
};


export default SmoothExperience;
