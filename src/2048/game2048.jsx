import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Game2048() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const size = parseInt(searchParams.get('gridSize')) || 4;

  const [grid, setGrid] = useState([]);
  const [hasMovedOnce, setHasMovedOnce] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const containerRef = useRef(null);

  // Génération initiale de la grille
  useEffect(() => {
    const newGrid = Array(size)
      .fill()
      .map(() => Array(size).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
  }, [size]);

  const addRandomTile = (grid) => {
    const empty = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === 0) empty.push([r, c]);
      }
    }
    if (empty.length === 0) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    grid[r][c] = 2;
  };

  const checkWinCondition = (grid) => {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === 2048) {
          setWon(true);
          return true;
        }
      }
    }
    return false;
  };

  const isGameOver = (grid) => {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const val = grid[r][c];
        if (val === 0) return false;
        if (c < size - 1 && grid[r][c] === grid[r][c + 1]) return false;
        if (r < size - 1 && grid[r][c] === grid[r + 1][c]) return false;
      }
    }
    return true;
  };

  const slideRowLeft = (row) => {
    const newRow = row.filter((val) => val !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;
      }
    }
    const merged = newRow.filter((val) => val !== 0);
    return [...merged, ...Array(size - merged.length).fill(0)];
  };

  const slideRowRight = (row) => slideRowLeft([...row].reverse()).reverse();

  const transpose = (matrix) => matrix[0].map((_, i) => matrix.map((row) => row[i]));

  const move = (direction) => {
    let newGrid = [...grid];
    let moved = false;

    const applyMove = (slideFn) => {
      for (let r = 0; r < size; r++) {
        const newRow = slideFn(newGrid[r]);
        if (JSON.stringify(newRow) !== JSON.stringify(newGrid[r])) {
          newGrid[r] = newRow;
          moved = true;
        }
      }
    };

    if (direction === 'left') applyMove(slideRowLeft);
    if (direction === 'right') applyMove(slideRowRight);
    if (direction === 'up') {
      newGrid = transpose(newGrid);
      applyMove(slideRowLeft);
      newGrid = transpose(newGrid);
    }
    if (direction === 'down') {
      newGrid = transpose(newGrid);
      applyMove(slideRowRight);
      newGrid = transpose(newGrid);
    }

    if (moved) {
      addRandomTile(newGrid);
      setGrid(newGrid);
      setHasMovedOnce(true);
      if (checkWinCondition(newGrid)) return;
      if (hasMovedOnce && isGameOver(newGrid)) setGameOver(true);
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      const keys = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'up',
        ArrowDown: 'down',
      };
      if (keys[e.key]) {
        e.preventDefault();
        move(keys[e.key]);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  });

  const restartGame = () => {
    const newGrid = Array(size)
      .fill()
      .map(() => Array(size).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
    setHasMovedOnce(false);
    setGameOver(false);
    setWon(false);
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: linear-gradient(to bottom, #d8f6ff, #b0e0f0);
          font-family: 'Segoe UI', Tahoma, sans-serif;
          color: #004d40;
          text-align: center;
          padding: 40px;
          overflow-x: hidden;
        }

        h1 {
          font-size: 36px;
          margin-bottom: 10px;
          color: #006064;
        }

        p {
          font-size: 16px;
          margin-bottom: 20px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(var(--size), 80px);
          gap: 14px;
          margin: 20px auto;
          padding: 14px;
          background: radial-gradient(circle at center, #aeefff 40%, #87ceeb 100%);
          border-radius: 16px;
          box-shadow:
            inset 0 0 20px rgba(0, 150, 200, 0.2),
            0 0 12px rgba(0, 200, 255, 0.1);
          width: fit-content;
        }

        .cell {
          width: 80px;
          height: 80px;
          visibility: hidden;
          opacity: 0;
          pointer-events: none;
        }

        .cell-glacon {
          width: 80px;
          height: 80px;
          background: linear-gradient(to bottom right, #e0f7ff, #b0dfff);
          color: #00363a;
          font-size: 24px;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          box-shadow:
            inset 0 0 6px rgba(255, 255, 255, 0.4),
            0 0 12px rgba(0, 150, 200, 0.4);
          transform: scale(1.05);
          animation: float 3s ease-in-out infinite;
          transition: transform 0.2s ease-in-out;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
          100% { transform: translateY(0px); }
        }

        .retour {
          display: block;
          margin: 40px auto;
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          background-color: #01c8fa;
          color: white;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: background-color 0.3s ease;
        }

        .retour:hover {
          background-color: #e53935;
        }

        #environment {
          position: relative;
          margin-top: 40px;
          height: 120px;
          overflow: hidden;
        }

        .penguin, .bear {
          position: absolute;
          bottom: 0;
          width: 60px;
          height: 60px;
          background-size: contain;
          background-repeat: no-repeat;
          animation: waddle 6s linear infinite;
        }

        .penguin {
          left: 10%;
          background-image: url('sprites/penguin.png');
        }

        .bear {
          right: 10%;
          background-image: url('sprites/bear.png');
        }

        @keyframes waddle {
          0% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }

        .snow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('sprites/snow.png');
          background-size: cover;
          opacity: 0.3;
          pointer-events: none;
        }

        .popup {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background: rgba(0, 0, 50, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
        }

        .popup-content {
          background: #e0f7ff;
          padding: 30px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 0 20px rgba(0, 150, 200, 0.4);
        }

        .popup-content h2 {
          margin-bottom: 10px;
          color: #006064;
        }

        .popup-content button {
          margin: 10px;
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          background-color: #4dd0e1;
          color: white;
          cursor: pointer;
        }

        .popup-content button:hover {
          background-color: #26c6da;
        }

        .hidden {
          display: none;
        }
      `}</style>

      <div>
        <header>
          <h1>🧊 2048 Iceberg Edition</h1>
          <p>Grille {size}×{size} générée</p>
          <button onClick={() => navigate('/index2048')} className="retour">
            🏠 Retour à l’accueil
          </button>
        </header>

        <main>
          <div id="gameContainer" ref={containerRef}>
            <div className="grid" style={{ '--size': size }}>
              {grid.map((row, r) =>
                row.map((val, c) => (
                  <div key={`${r}-${c}`} className={val ? 'cell-glacon' : 'cell'}>
                    {val || ''}
                  </div>
                ))
              )}
            </div>
          </div>

          <div id="environment">
            <div className="penguin"></div>
            <div className="bear"></div>
            <div className="snow"></div>
          </div>
        </main>

        {gameOver && (
          <div className="popup">
            <div className="popup-content">
              <h2>💥 Partie terminée !</h2>
              <p>Tu as perdu, la banquise est figée...</p>
              <button onClick={restartGame}>🔁 Recommencer</button>
              <button onClick={() => navigate('/index2048')}>🚪 Quitter</button>
            </div>
          </div>
        )}

        {won && (
          <div className="popup">
            <div className="popup-content">
              <h2>🎉 Bravo ! Vous avez atteint 2048 !</h2>
              <button onClick={() => setWon(false)}>Continuer</button>
              <button onClick={() => navigate('/')}>Arrêter</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
