// AuroraBackground.tsx
"use client";

export default function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />

      <style jsx>{`
        .aurora-blob {
          position: absolute;
          border-radius: 9999px;
          filter: blur(90px);
          mix-blend-mode: screen;
          opacity: 0.55;
          will-change: transform;
        }

        .aurora-blob-1 {
          width: 55vw;
          height: 55vw;
          max-width: 650px;
          max-height: 650px;
          top: -10%;
          left: -10%;
          background: radial-gradient(circle, #7c3aed 0%, #4c1d95 60%, transparent 75%);
          animation: drift1 26s ease-in-out infinite alternate;
        }

        .aurora-blob-2 {
          width: 45vw;
          height: 45vw;
          max-width: 520px;
          max-height: 520px;
          bottom: -15%;
          right: -5%;
          background: radial-gradient(circle, #6d28d9 0%, #312e81 60%, transparent 75%);
          animation: drift2 34s ease-in-out infinite alternate;
        }

        .aurora-blob-3 {
          width: 38vw;
          height: 38vw;
          max-width: 420px;
          max-height: 420px;
          top: 30%;
          left: 40%;
          background: radial-gradient(circle, #a855f7 0%, #581c87 60%, transparent 75%);
          animation: drift3 20s ease-in-out infinite alternate;
        }

        @keyframes drift1 {
          0%   { transform: translate(0, 0) scale(1); }
          33%  { transform: translate(8vw, 6vh) scale(1.1); }
          66%  { transform: translate(-4vw, 10vh) scale(0.95); }
          100% { transform: translate(5vw, -4vh) scale(1.05); }
        }

        @keyframes drift2 {
          0%   { transform: translate(0, 0) scale(1); }
          40%  { transform: translate(-7vw, -8vh) scale(1.08); }
          70%  { transform: translate(4vw, -3vh) scale(0.92); }
          100% { transform: translate(-3vw, 6vh) scale(1); }
        }

        @keyframes drift3 {
          0%   { transform: translate(0, 0) scale(1); }
          25%  { transform: translate(-6vw, 5vh) scale(1.15); }
          60%  { transform: translate(6vw, -6vh) scale(0.9); }
          100% { transform: translate(-2vw, -4vh) scale(1.1); }
        }
      `}</style>
    </div>
  );
}