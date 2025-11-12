// src/SudokuAccueil.jsx
import React from 'react';

export default function SudokuAccueil() {
  const tailles = [
    { size: 2, label: '2×2', className: 'easy' },
    { size: 3, label: '3×3', className: 'medium' },
    { size: 4, label: '4×4', className: 'hard' },
    { size: 5, label: '5×5', className: 'extreme' }
  ];

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: 'Orbitron', sans-serif;
          background: radial-gradient(circle at top, #0a0a0a 0%, #000 100%);
          color: white;
          text-align: center;
          overflow-x: hidden;
        }

        .menu {
          padding: 80px 20px;
          position: relative;
          animation: fadeIn 1s ease-out;
        }

        h1 {
          font-size: 3.5em;
          margin-bottom: 10px;
          color: #00fff9;
          text-shadow: 0 0 20px #00fff9, 0 0 40px #00d8ff;
          animation: neonPulse 2s infinite alternate;
        }

        @keyframes neonPulse {
          0% { text-shadow: 0 0 15px #00fff9; }
          100% { text-shadow: 0 0 35px #00fff9, 0 0 50px #00d8ff; }
        }

        p {
          font-size: 1.3em;
          color: #ccc;
          margin-bottom: 40px;
          letter-spacing: 1px;
        }

        .block-options {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 25px;
        }

        .difficulty {
          padding: 18px 40px;
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-size: 1.4em;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 0 15px rgba(255,255,255,0.1);
          position: relative;
          overflow: hidden;
        }

        .difficulty::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: rgba(255,255,255,0.2);
          transform: skewX(-20deg);
          transition: left 0.4s ease;
        }

        .difficulty:hover::before {
          left: 200%;
        }

        .difficulty:hover {
          transform: scale(1.08);
          box-shadow: 0 0 25px rgba(255,255,255,0.3);
        }

        .easy { background: linear-gradient(135deg, #2ecc71, #27ae60); }
        .medium { background: linear-gradient(135deg, #f1c40f, #d4ac0d); }
        .hard { background: linear-gradient(135deg, #e67e22, #d35400); }
        .extreme { background: linear-gradient(135deg, #e74c3c, #c0392b); }

        .return-button {
          margin-top: 60px;
          animation: fadeInUp 1s ease-out;
        }

        .back-button {
          padding: 14px 30px;
          background: linear-gradient(135deg, #222, #111);
          border: 2px solid #0ff;
          border-radius: 10px;
          color: #0ff;
          font-size: 1.1em;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background: #0ff;
          color: #000;
          box-shadow: 0 0 25px #0ff;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="menu">
        <h1>Sudoku Rush</h1>
        <p>Choisis ton format de grille pour commencer :</p>

        <div className="block-options">
          {tailles.map(({ size, label, className }) => (
            <a
              key={size}
              href={`/sudokugame?size=${size}`}
              className={`difficulty ${className}`}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="return-button">
          <a href="/hubjeux" className="back-button">← Retour à l’accueil</a>
        </div>
      </div>
    </>
  );
}
