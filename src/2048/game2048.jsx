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
        body { background: linear-gradient(to bottom,#d8f6ff,#b0e0f0); font-family:'Segoe UI',Tahoma,sans-serif; color:#004d40; text-align:center; padding:40px; overflow-x:hidden;}
        h1{font-size:36px;color:#006064;margin-bottom:10px;}
        .grid{display:grid;grid-template-columns:repeat(var(--size),80px);gap:14px;margin:20px auto;padding:14px;background:radial-gradient(circle,#aeefff 40%,#87ceeb 100%);border-radius:16px;box-shadow:inset 0 0 20px rgba(0,150,200,.2),0 0 12px rgba(0,200,255,.1);}
        .cell{width:80px;height:80px;visibility:hidden;opacity:0;}
        .cell-glacon{width:80px;height:80px;background:linear-gradient(to bottom right,#e0f7ff,#b0dfff);color:#00363a;font-size:24px;font-weight:bold;display:flex;align-items:center;justify-content:center;border-radius:12px;box-shadow:inset 0 0 6px rgba(255,255,255,.4),0 0 12px rgba(0,150,200,.4);animation:float 3s ease-in-out infinite;transition:transform .2s;}
        @keyframes float{0%{transform:translateY(0)}50%{transform:translateY(-4px)}100%{transform:translateY(0)}}
        .retour{margin:40px auto;padding:10px 20px;background:#01c8fa;color:#fff;border:none;border-radius:8px;cursor:pointer;box-shadow:0 4px 6px rgba(0,0,0,.1);}
        .retour:hover{background:#e53935;}
        #environment{position:relative;margin-top:40px;height:120px;overflow:hidden;}
        .penguin,.bear{position:absolute;bottom:0;width:60px;height:60px;background-size:contain;background-repeat:no-repeat;animation:waddle 6s linear infinite;}
        .penguin{left:10%;background-image:url('sprites/penguin.png');}
        .bear{right:10%;background-image:url('sprites/bear.png');}
        @keyframes waddle{0%{transform:translateY(0)}50%{transform:translateY(-5px)}100%{transform:translateY(0)}}
        .snow{position:absolute;top:0;left:0;width:100%;height:100%;background-image:url('sprites/snow.png');background-size:cover;opacity:.3;}
        .popup{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,50,.6);display:flex;align-items:center;justify-content:center;z-index:999;}
        .popup-content{background:#e0f7ff;padding:30px;border-radius:16px;text-align:center;box-shadow:0 0 20px rgba(0,150,200,.4);}
        .popup-content h2{margin-bottom:10px;color:#006064;}
        .popup-content button{margin:10px;padding:10px 20px;font-size:16px;border:none;border-radius:8px;background-color:#4dd0e1;color:white;cursor:pointer;}
        .popup-content button:hover{background-color:#26c6da;}
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
