// src/SudokuAccueil.jsx
import React from 'react';

export default function SudokuAccueil() {
  // 🔹 Liste des tailles de blocs disponibles
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
          font-family: 'Courier New', monospace;
          background-color: #111;
          color: white;
          text-align: center;
        }

        .menu {
          padding: 50px 20px;
        }

        h1 {
          font-size: 3em;
          margin-bottom: 10px;
          color: #0ff;
          text-shadow: 0 0 10px #0ff;
        }

        p {
          font-size: 1.2em;
          color: #ccc;
          margin-bottom: 20px;
        }

        .block-options {
          margin: 30px 0;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .difficulty {
          padding: 15px 30px;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-size: 1.3em;
          font-weight: bold;
          transition: all 0.3s ease;
          box-shadow: 0 0 10px rgba(255,255,255,0.2);
        }

        .easy {
          background-color: #2ecc71; /* vert */
        }

        .medium {
          background-color: #f1c40f; /* jaune */
        }

        .hard {
          background-color: #e67e22; /* orange */
        }

        .extreme {
          background-color: #e74c3c; /* rouge */
        }

        .difficulty:hover {
          transform: scale(1.1);
          filter: brightness(1.3);
          box-shadow: 0 0 20px rgba(255,255,255,0.4);
        }

        .return-button {
          margin-top: 40px;
        }

        .back-button {
          padding: 12px 25px;
          background: #333;
          color: white;
          text-decoration: none;
          border-radius: 8px;
          font-size: 1.1em;
          transition: background 0.3s ease;
        }

        .back-button:hover {
          background: #555;
        }
      `}</style>

      <div className="menu">
        {/* 🔸 Titre principal */}
        <h1>Sudoku Rush</h1>
        <p>Choisis le nombre de blocs :</p>

        {/* 🔸 Liens vers les différentes tailles de Sudoku */}
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

        {/* 🔸 Bouton retour vers le hub */}
        <div className="return-button">
          <a href="/" className="back-button">← Retour à l’accueil</a>
        </div>
      </div>
    </>
  );
}
