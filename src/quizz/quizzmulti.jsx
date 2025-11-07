import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function QuizzMulti() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode') || 'multi';
  const username = searchParams.get('username') || '';
  const room = searchParams.get('room') || '';
  const type = searchParams.get('type') || '';

  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState([]);

  const themes = ['Minecraft', 'HarryPotter', 'StarWars', 'Marvel', 'Geographie'];
  const [selectedTheme, setSelectedTheme] = useState('');
  const [pointsToWin, setPointsToWin] = useState(100);
  const [timePerQuestion, setTimePerQuestion] = useState(30);

  useEffect(() => {
    document.body.style.backgroundColor = '#eef3ff';

    const newSocket = io('https://localhost:4000', {
      transports: ['polling'],
      upgrade: false
    });

    setSocket(newSocket); // ✅ Stocker le socket

    newSocket.on('connect', () => {
      console.log("✅ Socket connecté avec polling :", newSocket.id);

      if (type === 'create') {
        newSocket.emit('createRoom', { username, room });
      } else {
        newSocket.emit('joinRoom', { username, room });
      }
    });

    newSocket.on('updatePlayers', (updatedList) => {
      setPlayers(updatedList);
    });

    newSocket.on('message', (msg) => {
      console.log('💬', msg);
    });

    newSocket.on('launchGame', () => {
      navigate('/startquizzmulti', {
        state: {
          selectedThemes: [selectedTheme],
          pointsToWin,
          timePerQuestion,
          mode: 'multi',
          username,
          room
        }
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [username, room, type, selectedTheme, pointsToWin, timePerQuestion, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (type !== 'create') {
      alert("Seul le créateur peut lancer la partie !");
      return;
    }

    if (!selectedTheme) {
      alert('Choisis un thème !');
      return;
    }

    if (!socket) {
      console.warn("⚠️ socket est null dans handleSubmit");
      return;
    }

    socket.emit('startGame', { room, selectedTheme, pointsToWin, timePerQuestion });

    navigate('/startquizzmulti', {
      state: {
        selectedThemes: [selectedTheme],
        pointsToWin,
        timePerQuestion,
        mode: 'multi',
        username,
        room
      }
    });
  };

  return (
    <>
      <style>{`
        .container {
          max-width: 700px;
          margin: 40px auto;
          background: white;
          padding: 40px 30px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(34, 17, 223, 0.1);
        }
        h1 {
          font-size: 28px;
          color: #0c00f6;
          margin-bottom: 20px;
          font-weight: bold;
        }
        .players {
          background: #e9f2ff;
          padding: 10px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .players ul {
          list-style: none;
          padding: 0;
        }
        .players li {
          margin: 5px 0;
          font-weight: bold;
          color: #333;
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
      `}</style>

      <div className="container">
        <h1>Salon Multijoueur : {room}</h1>
        <p><strong>Joueur :</strong> {username}</p>
        <div className="players">
          <h3>👥 Joueurs connectés :</h3>
          <ul>
            {players.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>

        {type === 'create' ? (
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

            <button type="submit">🚀 Lancer la partie</button>
          </form>
        ) : (
          <p>⏳ En attente que le créateur lance la partie...</p>
        )}
      </div>
    </>
  );
}
