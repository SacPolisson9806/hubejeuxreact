import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Game2048() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const size = parseInt(searchParams.get('gridSize')) || 4;

  // États du jeu
  const [grid, setGrid] = useState([]);
  const [hasMovedOnce, setHasMovedOnce] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const containerRef = useRef(null);

  // Génération initiale
  useEffect(() => {
    const newGrid = Array(size).fill().map(() => Array(size).fill(0));
    addRandomTile(newGrid);
    addRandomTile(newGrid);
    setGrid(newGrid);
  }, [size]);

  // Ajouter un nouveau bloc aléatoire
  const addRandomTile = (g) => {
    const empty = [];
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++)
        if (g[r][c] === 0) empty.push([r, c]);
    if (!empty.length) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    g[r][c] = 2;
  };

  // Vérifier victoire
  const checkWin = (g) => {
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++)
        if (g[r][c] === 2048) { setWon(true); return true; }
    return false;
  };

  // Vérifier fin de partie
  const isGameOver = (g) => {
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++) {
        if (g[r][c] === 0) return false;
        if (c < size - 1 && g[r][c] === g[r][c + 1]) return false;
        if (r < size - 1 && g[r][c] === g[r + 1][c]) return false;
      }
    return true;
  };

  // Déplacer les blocs
  const slideRowLeft = (row) => {
    const newRow = row.filter(v => v !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) { newRow[i] *= 2; newRow[i + 1] = 0; }
    }
    const merged = newRow.filter(v => v !== 0);
    return [...merged, ...Array(size - merged.length).fill(0)];
  };
  const slideRowRight = (row) => slideRowLeft([...row].reverse()).reverse();
  const transpose = (matrix) => matrix[0].map((_, i) => matrix.map(row => row[i]));

  // Mouvement global
  const move = (dir) => {
    let newGrid = [...grid];
    let moved = false;

    const apply = (fn) => {
      for (let r = 0; r < size; r++) {
        const newRow = fn(newGrid[r]);
        if (JSON.stringify(newRow) !== JSON.stringify(newGrid[r])) { newGrid[r] = newRow; moved = true; }
      }
    };

    if (dir === 'left') apply(slideRowLeft);
    if (dir === 'right') apply(slideRowRight);
    if (dir === 'up') { newGrid = transpose(newGrid); apply(slideRowLeft); newGrid = transpose(newGrid); }
    if (dir === 'down') { newGrid = transpose(newGrid); apply(slideRowRight); newGrid = transpose(newGrid); }

    if (moved) {
      addRandomTile(newGrid);
      setGrid(newGrid);
      setHasMovedOnce(true);
      if (checkWin(newGrid)) return;
      if (hasMovedOnce && isGameOver(newGrid)) setGameOver(true);
    }
  };

  // Gestion clavier
  useEffect(() => {
    const handleKey = (e) => {
      const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' };
      if (map[e.key]) { e.preventDefault(); move(map[e.key]); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  });

  const restartGame = () => {
    const newGrid = Array(size).fill().map(() => Array(size).fill(0));
    addRandomTile(newGrid); addRandomTile(newGrid);
    setGrid(newGrid); setHasMovedOnce(false); setGameOver(false); setWon(false);
  };

  return (
    <>
      {/* CSS compact */}
      <style>{`
  body {
    background: linear-gradient(to bottom, #e6f9ff 0%, #b8e8fa 40%, #9fdcf8 100%);
    font-family: 'Segoe UI', sans-serif;
    text-align: center;
    padding: 40px;
    overflow-x: hidden;
    color: #024d61;
  }

  h1 {
    font-size: 36px;
    color: #015f6f;
    margin-bottom: 10px;
    text-shadow: 1px 2px 4px rgba(255,255,255,0.8);
  }

  /* 🌊 Eau gelée qui s’adapte à la taille de la grille */
  .grid {
    display: grid;
    grid-template-columns: repeat(var(--size), 80px);
    gap: 14px;
    margin: 30px auto;
    padding: 18px;
    width: calc(var(--size) * 80px + (var(--size) - 1) * 14px + 36px);
    height: calc(var(--size) * 80px + (var(--size) - 1) * 14px + 36px);
    border-radius: 24px;
    position: relative;
    background: 
      radial-gradient(circle at 30% 30%, rgba(180,240,255,0.9) 0%, rgba(110,190,255,0.8) 60%, rgba(80,160,230,0.6) 100%);
    box-shadow:
      inset 0 0 35px rgba(255,255,255,0.6),
      0 10px 40px rgba(0,80,150,0.3),
      inset 0 -10px 30px rgba(0,120,255,0.25);
    overflow: hidden;
  }

  /* 💧 Reflets animés sur l’eau */
  .grid::before {
    content: '';
    position: absolute;
    top: -100%;
    left: 0;
    width: 100%;
    height: 200%;
    background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.3) 0%, transparent 70%);
    opacity: 0.25;
    animation: shimmer 8s linear infinite;
  }

  @keyframes shimmer {
    0% { transform: translateY(0); }
    100% { transform: translateY(100%); }
  }

  /* 🧊 Glaçons réalistes */
  .cell-glacon {
    width: 80px;
    height: 80px;
    background: linear-gradient(145deg, rgba(255,255,255,0.97), rgba(180,230,255,0.8));
    border-radius: 14px;
    box-shadow:
      inset 0 0 10px rgba(255,255,255,0.8),
      0 6px 12px rgba(0,80,130,0.3),
      0 0 15px rgba(180,240,255,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 24px;
    color: #012c3c;
    text-shadow: 1px 1px 3px rgba(255,255,255,0.5);
    animation: float 3s ease-in-out infinite;
    transition: transform 0.2s ease, background 0.3s ease;
  }

  .cell-glacon:hover {
    transform: scale(1.05);
    background: linear-gradient(145deg, rgba(255,255,255,1), rgba(210,250,255,0.9));
  }

  @keyframes float {
    0% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
    100% { transform: translateY(0); }
  }

  /* ❄️ Neige douce et réaliste */
  .snow {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background-image: url('sprites/snow.png');
    background-size: cover;
    opacity: 0.25;
    animation: snowFall 25s linear infinite;
    z-index: 0;
  }

  @keyframes snowFall {
    0% { background-position: 0 0; }
    100% { background-position: 0 1000px; }
  }

  /* 🐧 Ours & pingouin sur la banquise */
  #environment {
    position: relative;
    margin-top: 40px;
    height: 120px;
  }

  .penguin, .bear {
    position: absolute;
    bottom: 0;
    width: 60px;
    height: 60px;
    background-size: contain;
    background-repeat: no-repeat;
    animation: waddle 6s ease-in-out infinite;
  }

  .penguin {
    left: 15%;
    background-image: url('sprites/penguin.png');
  }

  .bear {
    right: 15%;
    background-image: url('sprites/bear.png');
  }

  @keyframes waddle {
    0% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
    100% { transform: translateY(0); }
  }

  /* 💬 Popup stylé glace */
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 30, 60, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }

  .popup-content {
    background: rgba(240,250,255,0.95);
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0 0 25px rgba(0,150,200,0.4);
    backdrop-filter: blur(6px);
    text-align: center;
  }

  .popup-content h2 {
    color: #015f6f;
    margin-bottom: 10px;
  }

  .popup-content button {
    margin: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    background-color: #4dd0e1;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .popup-content button:hover {
    background-color: #0097a7;
  }

  /* 🏠 Bouton retour */
  .retour {
    margin: 40px auto;
    padding: 12px 24px;
    border: none;
    border-radius: 10px;
    background: #00bcd4;
    color: white;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: background 0.2s;
  }

  .retour:hover {
    background: #0097a7;
  }
`}</style>
      <header>
        <h1>🧊 2048 Iceberg Edition</h1>
        <button onClick={() => navigate('/index2048')} className="retour">🏠 Accueil</button>
      </header>

      <main>
        <div className="grid" style={{ '--size': size }}>
          {grid.map((row, r) => row.map((val, c) => (
            <div key={`${r}-${c}`} className={val ? 'cell-glacon' : 'cell'}>{val || ''}</div>
          )))}
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
            <button onClick={restartGame}>🔁 Recommencer</button>
            <button onClick={() => navigate('/index2048')}>🚪 Quitter</button>
          </div>
        </div>
      )}

      {won && (
        <div className="popup">
          <div className="popup-content">
            <h2>🎉 Bravo ! 2048 atteint !</h2>
            <button onClick={() => setWon(false)}>Continuer</button>
            <button onClick={() => navigate('/')}>Arrêter</button>
          </div>
        </div>
      )}
    </>
  );
}
