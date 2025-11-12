// src/pages/SudokuGame.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function SudokuGame() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const blockGridSize = parseInt(searchParams.get('size')) || 3; // ex: 3 = 9 grands blocs
  const grid = Array.from({ length: blockGridSize * blockGridSize });

  // 🔹 État : case sélectionnée et contenu de la grille
  const [selected, setSelected] = useState(null); // {big, small}
  const [values, setValues] = useState({}); // "big-small" : "chiffre"

  // 🔹 Taille adaptative pour que tout rentre dans l’écran
  const maxGridWidth = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.8);
  const cellSize = Math.floor(maxGridWidth / (blockGridSize * 3 + blockGridSize * 0.5));

  useEffect(() => {
    console.log(`Affichage Sudoku ${blockGridSize}×${blockGridSize}`);
  }, [blockGridSize]);

  // 🔹 Quand on clique sur une mini-case
  const handleCellClick = (bigIndex, smallIndex) => {
    setSelected({ bigIndex, smallIndex });
  };

  // 🔹 Quand on clique sur un chiffre (barre du bas)
  const handleNumberClick = (num) => {
    if (!selected) return;
    const key = `${selected.bigIndex}-${selected.smallIndex}`;
    setValues((prev) => ({
      ...prev,
      [key]: prev[key] === num ? '' : num // re-cliquer efface
    }));
  };

  return (
    <div className="jeu">
      {/* 🔙 Retour */}
      <a href="/sudokuaccueil" className="back-button">← Retour à l’accueil</a>

      <h2 id="title">Sudoku {blockGridSize}×{blockGridSize}</h2>
      <p id="legend" className="legend">Clique une case puis un chiffre pour le placer.</p>

      {/* 🧩 Grille principale */}
      <div
        id="outer-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${blockGridSize}, auto)`,
          gridTemplateRows: `repeat(${blockGridSize}, auto)`,
          background: '#0ff',
          padding: '4px',
          borderRadius: '8px',
          gap: '2px',
          maxWidth: `${maxGridWidth}px`,
          margin: '0 auto'
        }}
      >
        {grid.map((_, bigIndex) => (
          <div key={bigIndex} className="big-block">
            <div
              className="mini-grid"
              style={{
                gridTemplateColumns: `repeat(3, ${cellSize}px)`,
                gridTemplateRows: `repeat(3, ${cellSize}px)`
              }}
            >
              {Array.from({ length: 9 }).map((_, smallIndex) => {
                const key = `${bigIndex}-${smallIndex}`;
                const isSelected =
                  selected?.bigIndex === bigIndex && selected?.smallIndex === smallIndex;
                return (
                  <div
                    key={smallIndex}
                    className={`mini-cell ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleCellClick(bigIndex, smallIndex)}
                  >
                    {values[key] || ''}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 🔢 Barre de sélection de chiffres */}
      <div className="number-bar">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button key={num} onClick={() => handleNumberClick(num)}>{num}</button>
        ))}
      </div>

      <style>{`
        body {
          margin: 0;
          font-family: monospace;
          background: #111;
          color: white;
          text-align: center;
          overflow: hidden;
        }

        .jeu {
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }

        #title {
          font-size: 2em;
          color: #0ff;
          text-shadow: 0 0 10px #0ff;
          animation: glow 2s infinite alternate;
        }

        @keyframes glow {
          from { text-shadow: 0 0 10px #0ff; }
          to { text-shadow: 0 0 25px #00ffff; }
        }

        .legend {
          color: #ccc;
          font-size: 1em;
        }

        .big-block {
          background: #222;
          border: 2px solid #0ff;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mini-grid {
          display: grid;
          background: #333;
          border: 1px solid #666;
        }

        .mini-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #555;
          background: #222;
          color: white;
          font-size: 1.2em;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }

        .mini-cell:hover {
          background: #444;
          transform: scale(1.05);
        }

        .mini-cell.selected {
          background: #00cccc;
          box-shadow: 0 0 10px #0ff;
          color: black;
        }

        .number-bar {
          margin-top: 10px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .number-bar button {
          width: 40px;
          height: 40px;
          background: #0ff;
          border: none;
          border-radius: 6px;
          color: black;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }

        .number-bar button:hover {
          background: #00cccc;
          transform: scale(1.1);
        }

        .back-button {
          margin: 10px;
          padding: 8px 16px;
          background: #333;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-size: 1em;
          transition: background 0.3s;
        }

        .back-button:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}
