// src/pages/CodeCrackerAccueil.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './codecracker.css'; // Ton style existant

export default function CodeCrackerAccueil() {
  const navigate = useNavigate();

  // 🔹 État pour le nombre de chiffres sélectionné
  const [digitCount, setDigitCount] = useState(4);

  // 🔹 Lancer le jeu avec la difficulté choisie
  const startGame = () => {
    navigate(`/codecracker?digits=${digitCount}`);
  };

  // 🔹 Retour au hub
  const goBack = () => {
    navigate('/hubjeux');
  };

  return (
    <div className="container">
      <h1>🔐 Code Cracker</h1>
      <p>Bienvenue dans le jeu de déduction ultime !</p>

      {/* 🔸 Règles du jeu */}
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

      {/* 🔸 Choix de la difficulté */}
      <div className="difficulty">
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
        <br /><br />
        <button onClick={startGame}>Commencer</button>
        <button onClick={goBack}>Retour à l'accueil</button>
      </div>
    </div>
  );
}
