import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ArrowRushAccueil() {
  const navigate = useNavigate(); // 🔹 Permet de naviguer vers d’autres pages

  // 🎮 Lance le jeu avec la difficulté choisie
  const startGame = (difficulty) => {
    navigate(`/arrowrushgame?difficulty=${difficulty}`); // 🔹 Passe la difficulté dans l’URL
  };

  // 🔧 Appliquer le style global au body (fond noir, texte blanc, police monospace)
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.fontFamily = "'Courier New', monospace";
    document.body.style.backgroundColor = '#111';
    document.body.style.color = 'white';
    document.body.style.textAlign = 'center';
  }, []);

  return (
    <>
      {/* 💅 Style intégré directement dans le composant */}
      <style>{`
        .menu {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100vh; /* occupe toute la hauteur de l’écran */
        }

        .buttons {
          display: flex;
          flex-direction: column;
          gap: 15px; /* espace entre les boutons */
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
          transition: background 0.3s; /* effet de survol */
        }

        .buttons button:hover {
          background: #666; /* change la couleur au survol */
        }

        h1 {
          font-size: 36px;
          margin-bottom: 10px;
          color: #0ff; /* titre bleu cyan */
        }

        p {
          font-size: 18px;
          margin-bottom: 20px;
        }
      `}</style>

      {/* 🧩 Structure de l’accueil */}
      <div className="menu">
        <h1>Arrow Rush</h1>
        <p>Choisis ta difficulté :</p>

        {/* 🎯 Boutons pour sélectionner la difficulté */}
        <div className="buttons">
          <button onClick={() => startGame('simple')}>Simple</button>
          <button onClick={() => startGame('difficile')}>Difficile</button>
          <button onClick={() => startGame('hardcore')}>Hardcore</button>
        </div>
      </div>
    </>
  );
}
