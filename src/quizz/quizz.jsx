import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function Quizz() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ récupération des infos venant de Connexion.jsx
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode') || 'solo';
  const username = searchParams.get('username') || '';
  const room = searchParams.get('room') || '';
  const type = searchParams.get('type') || '';

  // 🔌 socket
  const [socket, setSocket] = useState(null);

  const themes = ['Minecraft', 'HarryPotter', 'StarWars', 'Marvel', 'Geographie'];
  const [selectedTheme, setSelectedTheme] = useState('');
  const [pointsToWin, setPointsToWin] = useState(100);
  const [timePerQuestion, setTimePerQuestion] = useState(30);

  useEffect(() => {
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = '#f0f4f8';
    document.body.style.fontFamily = 'Arial, sans-serif';
    document.body.style.color = '#333';
    document.body.style.textAlign = 'center';

    if (mode === 'multi') {
      const newSocket = io('http://localhost:4000');
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('🟢 Connecté au serveur multijoueur');

        if (type === 'create') {
          newSocket.emit('createRoom', { username, room });
        } else {
          newSocket.emit('joinRoom', { username, room });
        }
      });

      newSocket.on('message', (msg) => {
        console.log('💬', msg);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [mode, username, room, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTheme) {
      alert('Choisis un thème !');
      return;
    }

    // 🔁 Envoie des infos de configuration + mode de jeu
    navigate('/startquizz', {
      state: {
        selectedThemes: [selectedTheme],
        pointsToWin,
        timePerQuestion,
        mode,
        username,
        room
      }
    });
  };

  return (
    <>
      <style>{`
        .container {
          max-width: 600px;
          margin: 50px auto;
          background: white;
          padding: 40px 20px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        h1 {
          font-size: 32px;
          color: #0c00f6;
          margin-bottom: 30px;
          font-weight: bold;
        }

        label {
          display: block;
          font-weight: bold;
          margin-bottom: 10px;
          text-align: left;
        }

        select {
          width: 100%;
          padding: 10px;
          margin-bottom: 20px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 16px;
        }

        button {
          padding: 12px 25px;
          background: #0c00f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }

        button:hover {
          background: #0a00d0;
        }

        .multi-info {
          background: #e6f0ff;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #c3daff;
        }
      `}</style>

      <div className="container">
        <h1>Configurer votre Quiz</h1>

        {mode === 'multi' && (
          <div className="multi-info">
            👥 Mode multijoueur activé<br />
            <strong>{type === 'create' ? 'Salon créé :' : 'Salon rejoint :'}</strong> {room}<br />
            <strong>Joueur :</strong> {username}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>Choisir le thème :</label>
          <select value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)} required>
            <option value="">-- Sélectionner --</option>
            {themes.map((theme) => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>

          <label>Nombre de points à atteindre :</label>
          <select value={pointsToWin} onChange={(e) => setPointsToWin(parseInt(e.target.value))}>
            {[...Array(10)].map((_, i) => {
              const val = 50 + i * 50;
              return <option key={val} value={val}>{val}</option>;
            })}
          </select>

          <label>Temps par question (secondes) :</label>
          <select value={timePerQuestion} onChange={(e) => setTimePerQuestion(parseInt(e.target.value))}>
            {[...Array(12)].map((_, i) => {
              const val = 5 + i * 5;
              return <option key={val} value={val}>{val} secondes</option>;
            })}
          </select>

          <button type="submit">Lancer le Quiz</button>
        </form>
      </div>
    </>
  );
}
