import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ArrowRushAccueil() {
  const navigate = useNavigate();

  const startGame = (difficulty) => {
    navigate(`/arrowrushgame?difficulty=${difficulty}`);
  };

  // 🔧 Appliquer le style global au body
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.fontFamily = "'Courier New', monospace";
    document.body.style.backgroundColor = '#111';
    document.body.style.color = 'white';
    document.body.style.textAlign = 'center';
  }, []);

  return (
    <>
      {/* 🔸 Style intégré */}
      <style>{`
        .menu {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .buttons {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 20px;
        }

        .buttons button {
          margin: 10px;
          padding: 15px 30px;
          background: #444;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.2em;
          cursor: pointer;
          transition: background 0.3s;
        }

        .buttons button:hover {
          background: #666;
        }

        h1 {
          font-size: 36px;
          margin-bottom: 10px;
          color: #0ff;
        }

        p {
          font-size: 18px;
          margin-bottom: 20px;
        }
      `}</style>

      <div className="menu">
        <h1>Arrow Rush</h1>
        <p>Choisis ta difficulté :</p>

        <div className="buttons">
          <button onClick={() => startGame('simple')}>Simple</button>
          <button onClick={() => startGame('difficile')}>Difficile</button>
          <button onClick={() => startGame('hardcore')}>Hardcore</button>
        </div>
      </div>
    </>
  );
}
