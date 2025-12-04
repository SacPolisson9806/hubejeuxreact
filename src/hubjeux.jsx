import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProtectedRoute from './auth/protectedroute.jsx';

const jeux = [
  { nom: 'Chiffre Mystère', description: 'Devine le chiffre choisi par l’ordinateur !', lien: '/connexion?jeu=chiffremystere' },
  { nom: 'Arrow Rush', description: 'Suis le rythme des flèches !', lien: '/connexion?jeu=arrowrushaccueil' },
  { nom: 'Sudoku', description: 'Remplis la grille de chiffres !', lien: '/connexion?jeu=sudokuaccueil' },
  { nom: 'Cemantix', description: 'Trouve le mot secret en t’aidant des mots donnés !', lien: '/connexion?jeu=cemantix' },
  { nom: 'Pendu', description: 'Trouve le mot secret.', lien: '/connexion?jeu=jeuxpendu' },
  { nom: 'Codecracker', description: 'Devine le code secret à 4 chiffres !', lien: '/connexion?jeu=codecrackerindex' },
  { nom: 'Mini quizz', description: 'Teste tes connaissances.', lien: '/connexion?jeu=Quizz' },
  { nom: 'Course d\'Évitement', description: 'Évite les voitures qui arrivent en face !', lien: '/connexion?jeu=accueil' },
  { nom: '2048', description: 'Essaie d\'atteindre 2048 !', lien: '/connexion?jeu=index2048' },
  { nom: 'snake', description: 'Joue au jeu du serpent !', lien: '/connexion?jeu=snake' }
];

const blockedGames = ['Cemantix', 'Arrow Rush'];

export default function Hub() {
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const cardRefs = useRef([]);

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

  const filteredJeux = jeux.filter(jeu =>
    jeu.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    cardRefs.current.forEach(card => {
      if (card) observer.observe(card);
    });
    return () => observer.disconnect();
  }, [filteredJeux]);

  return (
    <ProtectedRoute>
      <div className="hub-container">
        <style>{`
          html, body { margin:0; padding:0; height:100%; width:100%; font-family:Poppins, sans-serif; overflow:hidden; }
          body::before { content:""; position:fixed; top:0; left:0; width:100%; height:100%; background: radial-gradient(circle at top, #0a0a2a, #030314, #0a0a2a); background-size:400% 400%; animation: gradientMove 15s ease infinite; z-index:-1; }
          @keyframes gradientMove {0%{background-position:0% 50%;}50%{background-position:100% 50%;}100%{background-position:0% 50%;}}

          .hub-container { height:100vh; display:flex; flex-direction:column; color:white; position:relative; overflow:hidden; }
          header { text-align:center; padding:40px 0; }
          header h1 { font-size:28px; margin-bottom:10px; background: linear-gradient(90deg, #00d4ff, #00ffaa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
          header p { font-size:16px; color:#ccc; }
          .quete-btn { position:absolute; right:20px; top:20px; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border-radius:10px; padding:10px 20px; color:white; font-weight:bold; text-decoration:none; border:none; transition:0.3s; }
          .quete-btn:hover { background: rgba(255,255,255,0.2); }

          .search-container { display:flex; justify-content:center; margin-bottom:20px; }
          .search-input { width:300px; max-width:80%; padding:10px 15px; border-radius:25px; border:none; outline:none; background: rgba(255,255,255,0.1); color:white; text-align:center; transition:0.3s; }
          .search-input:focus { background: rgba(255,255,255,0.2); box-shadow:0 0 10px #00d4ff; }
.main-scroll {flex:1; display:flex; flex-wrap:wrap; justify-content:center; margin:0 20px; gap:30px; overflow-y:auto; padding-bottom:20px;

  /* Masquer la scrollbar */
  scrollbar-width: none; /* Firefox */
}
.main-scroll::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

          .game-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(15px); border:1px solid rgba(255,255,255,0.1); border-radius:20px; padding:20px; width:250px; transform: translateY(20px); opacity:0; transition: transform 0.3s, opacity 0.5s; }
          .game-card.visible { transform: translateY(0); opacity:1; }
          .game-card:hover { transform: translateY(-5px); box-shadow:0 0 35px rgba(0,180,255,0.3); }
          .game-card h2 { margin-bottom:10px; background: linear-gradient(90deg, #00d4ff, #00ffaa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
          .game-card p { font-size:14px; margin-bottom:15px; color:white; }

          .btn, .logout-btn, .modal button { font-weight:bold; cursor:pointer; transition: all 0.3s; }
          .btn.blocked { background: rgba(255,255,255,0.1); cursor:not-allowed; opacity:0.6; color:#ccc; }
          .btn { display:inline-block; padding:10px 20px; background: linear-gradient(90deg, #00d4ff, #00ffaa); color:#000; text-decoration:none; border:none; border-radius:10px; transition: all 0.3s ease; }
          .btn:hover { transform: scale(1.05); box-shadow:0 0 25px rgba(0,180,255,0.3); }

          .bottom-bar { display:flex; justify-content:center; align-items:center; background: rgba(255,255,255,0.05); backdrop-filter: blur(15px); padding:15px 20px; }
          .logout-btn { padding:10px 20px; background: linear-gradient(90deg, #00d4ff, #00ffaa); color:#000; border:none; border-radius:10px; font-weight:bold; cursor:pointer; transition: all 0.3s ease; }
          .logout-btn:hover { transform: scale(1.05); box-shadow:0 0 25px rgba(0,180,255,0.3); }

          .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; }
          .modal { background:white; border-radius:10px; padding:30px; width:300px; text-align:center; box-shadow:0 5px 15px rgba(0,0,0,0.3); }
          .modal p { margin-bottom:20px; font-size:16px; }
          .modal button { margin:0 10px; }
        `}</style>

        <header>
          <h1>🎮 Bienvenue {playerName} 🎮</h1>
          <p>Choisis un jeu et amuse-toi !</p>
          <Link to="/profile" className="quete-btn">Profile ⭐</Link>
        </header>

        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Rechercher un jeu..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="main-scroll">
          {filteredJeux.map((jeu, index) => {
            const isBlocked = blockedGames.includes(jeu.nom);
            return (
              <div
                className="game-card"
                key={index}
                ref={el => cardRefs.current[index] = el}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <h2>{jeu.nom}</h2>
                <p>{jeu.description}</p>
                {isBlocked ? (
                  <button className="btn blocked" disabled>Bientôt disponible</button>
                ) : (
                  <Link to={jeu.lien} className="btn">Jouer</Link>
                )}
              </div>
            );
          })}
        </div>

        <div className="bottom-bar">
          <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>🚪 Se déconnecter</button>
        </div>

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
    </ProtectedRoute>
  );
}
