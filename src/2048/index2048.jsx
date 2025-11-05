import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Index2048() {
  const navigate = useNavigate();
  const [gridSize, setGridSize] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gridSize) {
      navigate(`/game2048?gridSize=${gridSize}`);
    }
  };

  // 🔧 Appliquer le style global au body
  useEffect(() => {
    document.body.style.background = 'linear-gradient(to bottom, #d8f6ff, #b0e0f0)';
    document.body.style.fontFamily = "'Segoe UI', Tahoma, sans-serif";
    document.body.style.color = '#004d40';
    document.body.style.textAlign = 'center';
    document.body.style.padding = '40px';
    document.body.style.overflowX = 'hidden';
    document.body.style.border = 'none';
  }, []);

  return (
    <>
      {/* 🔸 Style intégré */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
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

        select, button {
          padding: 10px 15px;
          font-size: 16px;
          margin: 10px;
          border: none;
          border-radius: 8px;
          background-color: #4dd0e1;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button:hover, select:hover {
          background-color: #26c6da;
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

        #rules {
          text-align: center;
          margin-top: 30px;
        }

        ul {
          list-style: none;
          padding-left: 0;
          margin: 0;
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
          max-width: calc(var(--size) * 80px + (var(--size) - 1) * 14px + 28px);
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

        .slide {
          animation: slideIn 0.2s ease;
        }

        @keyframes slideIn {
          from { transform: translateY(10px); opacity: 0.5; }
          to { transform: translateY(0); opacity: 1; }
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
          <p>Bienvenue sur la banquise !</p>
        </header>

        <main>
          <form onSubmit={handleSubmit}>
            <label htmlFor="gridSize">Choisis la taille de la grille :</label>
            <select
              id="gridSize"
              value={gridSize}
              onChange={(e) => setGridSize(e.target.value)}
              required
            >
              <option value="" disabled>-- Choisir --</option>
              {[3, 4, 5, 6].map((i) => (
                <option key={i} value={i}>{i}×{i}</option>
              ))}
            </select>
            <br /><br />
            <button type="submit">❄️ Lancer la partie</button>
          </form>

          <section id="rules">
            <h2>📜 Règles du jeu</h2>
            <ul>
              <li>Utilise les flèches du clavier pour déplacer les blocs.</li>
              <li>Fusionne les blocs de même valeur pour atteindre 2048.</li>
              <li>Chaque mouvement ajoute un nouveau glaçon sur la banquise.</li>
              <li>Le jeu se termine quand il n’y a plus de mouvements possibles.</li>
            </ul>
          </section>
        </main>

        <button
          onClick={() => navigate('/')}
          className="retour"
        >
          🏠 Retour à l’accueil
        </button>
      </div>
    </>
  );
}
