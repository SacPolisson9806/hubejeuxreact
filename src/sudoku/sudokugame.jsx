import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function SudokuGame() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const blockGridSize = parseInt(searchParams.get('size')) || 3; // 2=4 blocs, 3=9 blocs, etc.
  const grid = Array.from({ length: blockGridSize * blockGridSize });

  useEffect(() => {
    console.log(`Affichage Sudoku ${blockGridSize}x${blockGridSize}`);
  }, [blockGridSize]);

  return (
    <div className="jeu">
      <a href="/sudokuaccueil" className="back-button">← Retour à l’accueil</a>

      <h2 id="title">Sudoku {blockGridSize}×{blockGridSize}</h2>
      <p id="legend" className="legend">
        Chaque grande case contient 9 mini-cases (3×3).
      </p>

      {/* 🧩 Grille principale (grandes cases) */}
      <div
        id="outer-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${blockGridSize}, auto)`,
          gridTemplateRows: `repeat(${blockGridSize}, auto)`,
          background: '#0ff',
          padding: '4px',
          borderRadius: '8px',
          gap: '1px', // 🔹 très petit espace entre les blocs
        }}
      >
        {grid.map((_, bigIndex) => (
          <div key={bigIndex} className="big-block">
            <div className="mini-grid">
              {Array.from({ length: 9 }).map((_, smallIndex) => (
                <div key={smallIndex} className="mini-cell"></div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        body { 
          margin: 0; 
          font-family: monospace; 
          background: #111; 
          color: white; 
          text-align: center; 
        }

        .jeu { 
          padding: 30px; 
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        #title { 
          font-size: 2em; 
          color: #0ff; 
          text-shadow: 0 0 10px #0ff; 
        }

        .legend { 
          font-size: 1em; 
          color: #ccc; 
          margin-bottom: 20px; 
        }

        .big-block {
          background: #222;
          border: 2px solid #0ff;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
        }

        .mini-grid {
          display: grid;
          grid-template-columns: repeat(3, 35px);
          grid-template-rows: repeat(3, 35px);
          background: #444;
          border: 1px solid #999;
        }

        .mini-cell {
          width: 35px;
          height: 35px;
          background: #333;
          border: 1px solid #555;
        }

        .mini-cell:hover {
          background: #555;
        }

        .back-button { 
          margin: 20px; 
          padding: 10px 20px; 
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
