// src/CodeCrackerAccueil.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CodeCrackerAccueil() {
  const navigate = useNavigate();
  const [digitCount, setDigitCount] = useState(4); // 🔢 Nombre de chiffres choisis pour le code (par défaut : 4)

  // 🔹 Fonction pour démarrer le jeu avec la difficulté sélectionnée
  const startGame = () => {
    navigate(`/codecracker?digits=${digitCount}`); // Redirige vers la page du jeu avec le paramètre choisi
  };

  // 🔹 Fonction pour revenir à l'accueil principal
  const goBack = () => {
    navigate('/hubjeux');
  };

  return (
    <div className="container">
      {/* 🧠 Titre principal */}
      <h1>🔐 Code Cracker</h1>
      <p>Bienvenue dans le jeu de déduction ultime !</p>

      {/* 📜 Section des règles du jeu */}
      <div className="rules">
        <h2>📜 Règles du jeu</h2>
        <p>Un code secret composé de chiffres est généré aléatoirement.</p>
        <p>À chaque tentative, tu reçois des indices :</p>
        <ul>
          <li><span className="green">🟢</span> chiffre correct à la bonne position</li>
          <li><span className="yellow">🟡</span> chiffre correct à la mauvaise position</li>
          <li><span className="red">🔴</span> chiffre absent du code</li>
        </ul>
        <p>Devine le code en un minimum d’essais !</p>
      </div>

      {/* 🎯 Choix de la difficulté */}
      <div className="difficulty">
        <h2>🎯 Choisis la difficulté</h2>
        <label htmlFor="digitCount">Nombre de chiffres :</label><br /><br />

        {/* Menu déroulant pour choisir la taille du code */}
        <select
          id="digitCount"
          value={digitCount}
          onChange={(e) => setDigitCount(parseInt(e.target.value))}
        >
          <option value={4}>Facile — 4 chiffres</option>
          <option value={5}>Moyen — 5 chiffres</option>
          <option value={6}>Difficile — 6 chiffres</option>
        </select>

        <br /><br />

        {/* Boutons de navigation */}
        <button onClick={startGame}>Commencer</button>
        <button onClick={goBack}>Retour à l'accueil</button>
      </div>

      {/* 💅 Style CSS intégré dans le composant */}
      <style>{`
        body {
          font-family: 'Segoe UI', sans-serif;
          background: #121212;
          color: #fff;
          text-align: center;
          padding: 40px;
        }

        .container {
          max-width: 700px;
          margin: auto;
        }

        /* 🎚 Style du sélecteur de difficulté */
        select {
          padding: 12px 16px;
          font-size: 18px;
          border-radius: 10px;
          border: 2px solid #4caf50;
          background-color: #1e1e1e;
          color: #fff;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        select:hover {
          border-color: #81c784;
          background-color: #2c2c2c;
        }

        /* 🟩 Boutons d’action */
        button {
          padding: 12px 20px;
          font-size: 18px;
          border-radius: 10px;
          border: none;
          background-color: #4caf50;
          color: #fff;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin: 5px;
        }

        button:hover {
          background-color: #66bb6a;
        }

        /* 📦 Sections d’infos */
        .rules, .difficulty {
          margin-top: 20px;
          padding: 16px;
          background-color: #1a1a1a;
          border-radius: 8px;
          box-shadow: 0 0 6px rgba(76, 175, 80, 0.2);
        }

        ul {
          list-style: none;
          padding: 0;
        }

        ul li {
          margin: 8px 0;
          font-size: 16px;
        }

        /* 🧩 Style des champs texte (non utilisés ici mais présents pour cohérence visuelle) */
        input[type="text"] {
          padding: 12px 16px;
          font-size: 20px;
          border-radius: 10px;
          border: 2px solid #4caf50;
          background-color: #1e1e1e;
          color: #fff;
          text-align: center;
          letter-spacing: 8px;
          width: 200px;
          transition: all 0.3s ease;
        }

        input[type="text"]::placeholder {
          color: #888;
          letter-spacing: normal;
        }

        input[type="text"]:focus {
          outline: none;
          border-color: #81c784;
          background-color: #2c2c2c;
        }

        /* 🔴🟡🟢 Couleurs des indices */
        .green { color: #4caf50; }
        .yellow { color: #ffeb3b; }
        .red { color: #f44336; }
      `}</style>
    </div>
  );
}
