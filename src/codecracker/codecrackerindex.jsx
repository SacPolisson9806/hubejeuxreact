// src/CodeCrackerAccueil.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CodeCrackerAccueil() {
  const navigate = useNavigate();
  const [digitCount, setDigitCount] = useState(4);

  const startGame = () => navigate(`/codecracker?digits=${digitCount}`);
  const goBack = () => navigate('/hubjeux');

  return (
    <div className="container">
      {/* 🧠 Titre */}
      <h1>🔐 Code Cracker</h1>
      <p>Bienvenue dans le jeu de déduction ultime !</p>

      {/* 🔹 Blocs côte à côte */}
      <div className="content">
        {/* 📜 Règles */}
        <div className="rules block">
          <h2>📜 Règles du jeu</h2>
          <p>Un code secret composé de chiffres est généré aléatoirement.</p>
          <p>À chaque tentative, tu reçois des indices :</p>
          <ul>
            <li><span className="green">🟢</span> chiffre correct à la bonne position</li>
            <li><span className="yellow">🟡</span> chiffre correct à la mauvaise position</li>
            <li><span className="red">🔴</span> chiffre absent du code</li>
          </ul>
        </div>

        {/* 🎯 Choix difficulté */}
        <div className="difficulty block">
          <h2>🎯 Choisis la difficulté</h2>
          <label htmlFor="digitCount">Nombre de chiffres :</label><br /><br />
          <select
            id="digitCount"
            value={digitCount}
            onChange={(e) => setDigitCount(parseInt(e.target.value))}
          >
            <option value={4}>Facile — 4 chiffres</option>
            <option value={5}>Moyen — 5 chiffres</option>
            <option value={6}>Difficile — 6 chiffres</option>
          </select>
        </div>
      </div>

      {/* 🔘 Boutons fixes en bas */}
      <div className="bottom">
        <button onClick={startGame}>Commencer</button>
        <button onClick={goBack}>Retour à l'accueil</button>
      </div>

      {/* 🎨 Styles */}
      <style>{`
        body {
          font-family: 'Segoe UI', sans-serif;
          margin: 0;
          padding: 0;
          height: 100vh;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          color: #fff;
          overflow: hidden; /* pas de scroll */
        }

        .container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          align-items: center;
          padding: 20px;
          box-sizing: border-box;
        }

        h1 {
          font-size: 2.8rem;
          margin-bottom: 10px;
          text-shadow: 2px 2px 6px rgba(0,0,0,0.5);
        }

        p {
          margin-bottom: 20px;
          font-size: 1.2rem;
          color: #ddd;
        }

        /* 🔹 Conteneur blocs côte à côte */
        .content {
          display: flex;
          justify-content: space-between;
          width: 100%;
          max-width: 1000px;
          gap: 20px;
          align-items: flex-start; /* s’adapte au contenu */
        }

        /* 🔹 Blocs individuels avec effet hover */
        .block {
          flex: 1;
          padding: 20px;
          background-color: rgba(30,30,30,0.85);
          border-radius: 12px;
          box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .block:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(76, 175, 80, 0.6);
        }

        ul {
          list-style: none;
          padding: 0;
        }

        ul li {
          margin: 8px 0;
          font-size: 16px;
        }

        select {
          padding: 12px 16px;
          font-size: 18px;
          border-radius: 10px;
          border: 2px solid #4caf50;
          background-color: #1e1e1e;
          color: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        select:hover {
          border-color: #81c784;
          background-color: #2c2c2c;
        }

        /* 🔘 Boutons fixes en bas */
        .bottom {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 70px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          background: linear-gradient(to top, #121212 0%, transparent 50%);
          padding: 10px 0;
        }

        button {
          padding: 14px 28px;
          font-size: 18px;
          border-radius: 12px;
          border: none;
          background-color: #4caf50;
          color: #fff;
          cursor: pointer;
          transition: transform 0.2s ease, background-color 0.3s ease, box-shadow 0.3s ease;
        }

        button:hover {
          transform: scale(1.05);
          background-color: #66bb6a;
          box-shadow: 0 0 12px rgba(102,187,106,0.6);
        }

        .green { color: #4caf50; }
        .yellow { color: #ffeb3b; }
        .red { color: #f44336; }

        @media (max-width: 900px) {
          .content {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
