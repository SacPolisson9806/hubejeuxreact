import React from 'react';
import { Link } from 'react-router-dom';

const jeux = [
  {
    nom: 'Chiffre Mystère',
    description: 'Devine le chiffre choisi par l’ordinateur !',
    lien: '/connexion?jeu=Chiffremystere'
  },
  {
    nom: 'Arrow Rush',
    description: 'Suis le rythme des flèches !',
    lien: '/connexion?jeu=Arrowrushaccueil'
  },
  {
    nom: 'Sudoku',
    description: 'Remplis la grille de chiffres !',
    lien: '/connexion?jeu=Sudokuaccueil'
  },
  {
    nom: 'Cemantix',
    description: 'Trouve le mot secret en t’aidant des mots donnés !',
    lien: '/connexion?jeu=Cemantix'
  },
  {
    nom: 'Pendu',
    description: 'Trouve le mot secret.',
    lien: '/connexion?jeu=Jeuxpendu'
  },
  {
    nom: 'Codecracker',
    description: 'Devine le code secret à 4 chiffres !',
    lien: '/connexion?jeu=Codecrackerindex'
  },
  {
    nom: 'Mini quizz',
    description: 'Teste tes connaissances.',
    lien: '/connexion?jeu=Quizz'
  },
  {
    nom: 'Course d\'Évitement',
    description: 'Évite les voitures qui arrivent en face !',
    lien: '/connexion?jeu=Accueil'
  },
  {
    nom: '2048',
    description: 'Essaie d\'atteindre 2048 !',
    lien: '/connexion?jeu=Index2048'
  }
];

export default function Hub() {
  return (
    <div className="hub-container">
      {/* 🔸 Style intégré */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Arial, sans-serif;
          background: white;
          color: #333;
          text-align: center;
        }

        .hub-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        header {
          background: #0c00f6;
          color: white;
          padding: 40px 0;
        }

        header p {
          font-size: 18px;
          margin-top: 10px;
        }

        main {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          margin: 50px 20px;
          gap: 30px;
        }

        .game-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          width: 250px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s;
        }

        .game-card:hover {
          transform: translateY(-10px);
        }

        .game-card h2 {
          margin-bottom: 10px;
          color: #0c00f6;
        }

        .game-card p {
          font-size: 14px;
          margin-bottom: 20px;
        }

        .btn {
          display: inline-block;
          padding: 10px 20px;
          background: #0c00f6;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          transition: background 0.3s;
        }

        .btn:hover {
          background: #0500a8;
        }

        footer {
          background: #333;
          color: white;
          padding: 20px 0;
          margin-top: auto;
        }
      `}</style>

      <header>
        <h1>🎮 Bienvenue sur mon Hub de Jeux</h1>
        <p>Choisis un jeu et amuse-toi !</p>
      </header>

      <main>
        {jeux.map((jeu, index) => (
          <div className="game-card" key={index}>
            <h2>{jeu.nom}</h2>
            <p>{jeu.description}</p>
            <Link to={jeu.lien} className="btn">Jouer</Link>
          </div>
        ))}
      </main>

      <footer>
        <p>© 2025 Mon Hub de Jeux</p>
      </footer>
    </div>
  );
}
