import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const jeux = [
  { nom: 'Chiffre Mystère', description: 'Devine le chiffre choisi par l’ordinateur !', lien: '/connexion?jeu=chiffremystere' },
  { nom: 'Arrow Rush', description: 'Suis le rythme des flèches !', lien: '/connexion?jeu=arrowrushaccueil' },
  { nom: 'Sudoku', description: 'Remplis la grille de chiffres !', lien: '/connexion?jeu=sudokuaccueil' },
  { nom: 'Cemantix', description: 'Trouve le mot secret en t’aidant des mots donnés !', lien: '/connexion?jeu=cemantix' },
  { nom: 'Pendu', description: 'Trouve le mot secret.', lien: '/connexion?jeu=jeuxpendu' },
  { nom: 'Codecracker', description: 'Devine le code secret à 4 chiffres !', lien: '/connexion?jeu=codecrackerindex' },
  { nom: 'Mini quizz', description: 'Teste tes connaissances.', lien: '/connexion?jeu=Quizz' },
  { nom: 'Course d\'Évitement', description: 'Évite les voitures qui arrivent en face !', lien: '/connexion?jeu=accueil' },
  { nom: '2048', description: 'Essaie d\'atteindre 2048 !', lien: '/connexion?jeu=index2048' }
];

export default function Hub() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('playerName');
    if (!storedName) {
      navigate('/');
    } else {
      setPlayerName(storedName);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("playerName");
    navigate("/");
  };

  return (
    <div className="hub-container">
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: Arial, sans-serif; background:white; color:#333; text-align:center; }
        .hub-container { min-height:100vh; display:flex; flex-direction:column; }
        header { background:#0c00f6; color:white; padding:40px 0; position:relative; }

        /* Nouveau bouton Quêtes */
        .quete-btn {
          position:absolute;
          right:20px;
          top:20px;
          background:white;
          color:#0c00f6;
          padding:10px 20px;
          border-radius:6px;
          font-weight:bold;
          text-decoration:none;
          border:none;
          cursor:pointer;
          transition:0.3s;
        }
        .quete-btn:hover {
          background:#dcdcff;
        }

        header p { font-size:18px; margin-top:10px; }
        main { display:flex; flex-wrap:wrap; justify-content:center; margin:50px 20px; gap:30px; }
        .game-card { background:white; border-radius:10px; padding:20px; width:250px; box-shadow:0 5px 15px rgba(0,0,0,0.1); transition: transform 0.3s; }
        .game-card:hover { transform: translateY(-10px); }
        .game-card h2 { margin-bottom:10px; color:#0c00f6; }
        .game-card p { font-size:14px; margin-bottom:20px; }
        .btn, .logout-btn, .modal button { 
          display:inline-block; padding:10px 20px; background:#0c00f6; color:white; text-decoration:none; border:none; border-radius:6px; cursor:pointer; font-weight:bold; transition: background 0.3s;
        }
        .btn:hover, .logout-btn:hover, .modal button:hover { background:#0500a8; }
        .logout-container { display:flex; justify-content:center; margin:40px 0; }
        footer { background:#333; color:white; padding:20px 0; margin-top:auto; }

        .btn.blocked {
          background: #999;
          cursor: not-allowed;
          opacity: 0.6;
        }

        .modal-overlay { 
          position: fixed; top:0; left:0; width:100%; height:100%; 
          background: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; 
        }
        .modal { 
          background:white; border-radius:10px; padding:30px; width:300px; text-align:center; 
          box-shadow:0 5px 15px rgba(0,0,0,0.3); 
        }
        .modal p { margin-bottom:20px; font-size:16px; }
        .modal button { margin:0 10px; }
      `}</style>

      <header>
        <h1>🎮 Bienvenue {playerName} 🎮</h1>
        <p>Choisis un jeu et amuse-toi !</p>

        {/* 🔥 Bouton pour accéder aux quêtes */}
        <Link to="/profile" className="quete-btn">Profile ⭐</Link>
      </header>

      <main>
        {jeux.map((jeu, index) => {
          const isBlocked = jeu.nom === 'Cemantix';
          return (
            <div className="game-card" key={index}>
              <h2>{jeu.nom}</h2>
              <p>{jeu.description}</p>
              {isBlocked ? (
                <button className="btn blocked" disabled>Jouer</button>
              ) : (
                <Link to={jeu.lien} className="btn">Jouer</Link>
              )}
            </div>
          );
        })}
      </main>

      <div className="logout-container">
        <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
          🚪 Se déconnecter
        </button>
      </div>

      <footer>
        <p>© 2025 Mon Hub de Jeux</p>
      </footer>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Voulez-vous vraiment vous déconnecter ?</p>
            <button className="yes" onClick={handleLogout}>Oui</button>
            <button className="no" onClick={() => setShowLogoutModal(false)}>Non</button>
          </div>
        </div>
      )}
    </div>
  );
}
