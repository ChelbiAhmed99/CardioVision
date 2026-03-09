import React from 'react';

export function HeartVideo() {
  return (
    <div className="my-8">
      <div className="w-full h-48 bg-cardio-950/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 ring-1 ring-white/5 overflow-hidden relative group">

        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

        <div className="relative w-full h-full">
          {/* Background Tech Grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px'
          }} />

          {/* Video Container */}
          <div className="absolute inset-0 flex items-center justify-center mix-blend-screen">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-60"
              style={{ filter: 'hue-rotate(220deg) saturate(2) brightness(1.2)' }}
            >
              <source src="src/assests/mask.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Left/Right Vignette for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-cardio-950 via-transparent to-cardio-950 pointer-events-none"></div>

          {/* Deep Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-blue-500/10 pointer-events-none" />

          {/* Animated ECG Line */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <svg viewBox="0 0 200 100" className="w-full h-20 opacity-80" preserveAspectRatio="none">
              <path
                d="M0,50 L40,50 L45,50 L47,20 L50,80 L53,50 L55,50 L95,50 L100,50 L102,20 L105,80 L108,50 L110,50 L150,50 L155,50 L157,20 L160,80 L163,50 L165,50 L200,50"
                fill="none"
                stroke="url(#ecgNeonGradient)"
                strokeWidth="2"
                strokeDasharray="200"
                strokeDashoffset="200"
                className="animate-dash"
                style={{ filter: 'drop-shadow(0 0 4px rgba(6,182,212,0.8))' }}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="200"
                  to="-200"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </path>
              <defs>
                <linearGradient id="ecgNeonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="50%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}