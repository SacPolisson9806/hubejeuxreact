import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const routesJeux = {
  chiffremystere: '/chiffremystereaccueil',
  arrowrushaccueil: '/arrowrushaccueil',
  cemantix: '/cemantix',
  jeuxpendu: '/jeuxpendu',
  quizzsolo: '/quizzsolo',       // solo
  quizzmulti: '/quizzmulti',     // multi
  codecrackerindex: '/codecrackerindex',
  sudokuaccueil: '/sudokuaccueil',
  index2048: '/index2048',
  accueil: '/accueil',
  snake: '/snake'
};

export default function Connexion() {
  const [searchParams] = useSearchParams();
  const jeu = searchParams.get('jeu');
  const navigate = useNavigate();

  const [mode, setMode] = useState('solo');
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [multiAction, setMultiAction] = useState('join'); // ✅ "join" ou "create"

  useEffect(() => {
    if (!jeu) {
      alert("Jeu inconnu ou non sélectionné.");
      navigate('/');
    }
  }, [jeu, navigate]);

const handleSubmit = (e) => {
  e.preventDefault();

  if (mode === 'multi' && (!username || !room)) {
    alert("Remplis ton pseudo et le code du salon !");
    return;
  }

  let gameRoute = routesJeux[jeu?.toLowerCase()];

  // Cas particuliers pour Quizz
  if (jeu.toLowerCase() === 'quizz' && mode === 'solo') {
    gameRoute = '/quizzsolo';
  } else if (jeu.toLowerCase() === 'quizz' && mode === 'multi') {
    gameRoute = '/quizzmulti';
  }

  // Vérifie que le jeu existe
  if (!gameRoute) {
    alert("Jeu inconnu !");
    return;
  }

  // Redirection avec navigate
  if (mode === 'solo') {
    navigate(`${gameRoute}?mode=solo`);
  } else {
    navigate(
      `${gameRoute}?mode=multi&username=${encodeURIComponent(username)}&room=${encodeURIComponent(room)}&type=${multiAction}`
    );
  }
};



  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1e1e2f, #2c3e50);
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .container {
          background-color: #2c2c3c;
          padding: 30px 40px;
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        h1 {
          font-size: 24px;
          margin-bottom: 20px;
          color: #00bfff;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        label {
          font-weight: bold;
          text-align: left;
        }

        select, input {
          padding: 10px;
          border: none;
          border-radius: 6px;
          background-color: #3c3c4c;
          color: #fff;
          font-size: 16px;
        }

        select:focus, input:focus {
          outline: none;
          box-shadow: 0 0 5px #00bfff;
        }

        button {
          padding: 12px;
          background-color: #00bfff;
          color: #fff;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #0099cc;
        }

        a {
          color: #ccc;
          text-decoration: none;
          font-size: 14px;
        }

        a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="container">
        <h1>🎮 Lancer le jeu : {jeu}</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="mode">Mode de jeu :</label>
          <select
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            required
          >
            <option value="solo">Solo</option>
            <option value="multi">Multijoueur</option>
          </select>

          {mode === 'multi' && (
            <div id="multiFields">
              <label htmlFor="multiAction">Action multijoueur :</label>
              <select
                id="multiAction"
                value={multiAction}
                onChange={(e) => setMultiAction(e.target.value)}
              >
                <option value="join">Rejoindre un salon</option>
                <option value="create">Créer un salon</option>
              </select>

              <input
                type="text"
                id="username"
                placeholder="Ton pseudo"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="text"
                id="room"
                placeholder={
                  multiAction === 'create'
                    ? 'Code du salon à créer'
                    : 'Code du salon à rejoindre'
                }
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>
          )}

          <button type="submit">Jouer</button>
        </form>

        <p><a href="/hubjeux">← Retour au hub</a></p>
      </div>
    </>
  );
}
