'use client';

import { useEffect, useRef } from 'react';

// PRNG determinista (mismo resultado en servidor y cliente, evita mismatches de hidratación)
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildStars(count) {
  const rand = mulberry32(1337);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: rand() * 100,
    left: rand() * 100,
    size: rand() * 1.6 + 0.6,
    duration: 2.4 + rand() * 3.2,
    delay: rand() * 4,
    depth: rand() * 0.6 + 0.2, // qué tanto se mueve con el parallax (estrellas "lejanas" se mueven menos)
  }));
}

const STARS = buildStars(90);

export default function CosmicBackground() {
  const blobARef = useRef(null);
  const blobBRef = useRef(null);
  const blobCRef = useRef(null);
  const starsRef = useRef(null);
  const frame = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      target.current = { x, y };
    }

    function tick() {
      // easing suave hacia la posición objetivo, evita movimientos bruscos
      current.current.x += (target.current.x - current.current.x) * 0.06;
      current.current.y += (target.current.y - current.current.y) * 0.06;
      const { x, y } = current.current;

      if (blobARef.current) blobARef.current.style.transform = `translate3d(${x * 70}px, ${y * 50}px, 0)`;
      if (blobBRef.current) blobBRef.current.style.transform = `translate3d(${x * -55}px, ${y * -40}px, 0)`;
      if (blobCRef.current) blobCRef.current.style.transform = `translate3d(${x * 35}px, ${y * -60}px, 0)`;
      if (starsRef.current) starsRef.current.style.transform = `translate3d(${x * 18}px, ${y * 14}px, 0)`;

      frame.current = requestAnimationFrame(tick);
    }

    window.addEventListener('mousemove', handleMove);
    frame.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-cosmos">
      {/* base gradient profundo */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, #17123a 0%, #05040d 55%), linear-gradient(180deg, #05040d 0%, #0b0a1c 100%)',
        }}
      />

      {/* blobs de color con drift autónomo + parallax por mouse */}
      <div ref={blobARef} className="absolute left-[8%] top-[8%] h-[32rem] w-[32rem] rounded-full bg-violet-600/30 blur-[110px] animate-drift" />
      <div ref={blobBRef} className="absolute right-[5%] top-[18%] h-[26rem] w-[26rem] rounded-full bg-cyan-500/20 blur-[100px] animate-driftSlow" />
      <div ref={blobCRef} className="absolute bottom-[-6%] left-[30%] h-[30rem] w-[30rem] rounded-full bg-fuchsia-600/20 blur-[120px] animate-drift" />

      {/* estrellas */}
      <div ref={starsRef} className="absolute inset-0">
        {STARS.map((s) => (
          <span
            key={s.id}
            className="star-dot animate-twinkle"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      {/* viñeta para enfocar el centro */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 40%, transparent 40%, rgba(5,4,13,0.55) 100%)' }}
      />
    </div>
  );
}
