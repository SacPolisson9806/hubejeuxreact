import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cemantix() {
  const navigate = useNavigate();

  // 🔹 Démarre la partie → redirige vers la page du jeu
  const startGame = () => {
    navigate('/cemantixgame');
  };

  // 🔹 Retourne au hub principal des jeux
  const goBack = () => {
    navigate('/hubjeux');
  };

  // 🔧 Applique un style global au <body> dès que le composant est monté
  useEffect(() => {
    document.body.style.fontFamily = "'Courier New', Courier, monospace";
    document.body.style.backgroundColor = '#fdf6e3';
    document.body.style.color = '#333';
    document.body.style.textAlign = 'center';
    document.body.style.padding = '40px';
  }, []);

  return (
    <>
      {/* 🎨 Style CSS intégré directement ici pour simplifier la structure */}
      <style>{`
        h1 {
          font-size: 36px;
          margin-bottom: 10px;
          color: #2e7d32;
        }

        p {
          font-size: 18px;
          margin-bottom: 20px;
        }

        /* 🧾 Sections d’explications et de boutons */
        .rules, .difficulty {
          background-color: #fff;
          border: 2px dashed #ccc;
          padding: 20px;
          margin: 20px auto;
          border-radius: 12px;
          max-width: 600px;
          box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
        }

        ul {
          list-style-type: none;
          padding: 0;
        }

        ul li {
          font-size: 16px;
          margin: 8px 0;
        }

        /* 🟩 Styles pour les champs et boutons (mêmes couleurs que le thème principal) */
        input[type="text"] {
          padding: 12px 16px;
          font-size: 20px;
          border-radius: 8px;
          border: 2px solid #2e7d32;
          background-color: #fefefe;
          color: #333;
          width: 250px;
          text-align: center;
        }

        input[type="text"]::placeholder {
          color: #aaa;
        }

        /* 🟢 Boutons principaux */
        button {
          padding: 12px 20px;
          font-size: 18px;
          border-radius: 8px;
          border: none;
          background-color: #2e7d32;
          color: #fff;
          cursor: pointer;
          margin: 10px;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #388e3c;
        }

        /* 📋 Historique (réutilisable dans la page du jeu) */
        #history {
          margin-top: 30px;
          font-size: 16px;
          text-align: left;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          background-color: #fff;
          border: 1px solid #ccc;
          padding: 20px;
          border-radius: 8px;
        }
      `}</style>

      {/* 🧩 Conteneur principal de la page d’accueil du jeu Cemantix */}
      <div className="container">
        <h1>🧠 Cemantix</h1>
        <p>Bienvenue dans le jeu de déduction sémantique !</p>

        {/* 📜 Section expliquant les règles du jeu */}
        <div className="rules">
          <h2>📜 Règles du jeu</h2>
          <p>Un mot mystère est caché. À chaque mot proposé, tu obtiens un score de proximité :</p>
          <ul>
            <li>🔵 Score faible → mot éloigné</li>
            <li>🟡 Score moyen → mot partiellement lié</li>
            <li>🔴 Score élevé → mot très proche</li>
          </ul>
          <p>Devine le mot en un minimum d’essais !</p>
        </div>

        {/* 🎯 Zone de sélection/démarrage */}
        <div className="difficulty">
          <button onClick={startGame}>Commencer</button>
          <br /><br />
          <button onClick={goBack}>Retour à l’accueil des jeux</button>
        </div>
      </div>
    </>
  );
}
