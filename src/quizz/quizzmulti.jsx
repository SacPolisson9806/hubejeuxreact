import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function QuizzMulti() {
  const navigate = useNavigate();
  const location = useLocation();

  // ⚡ Récupération des paramètres passés via l'URL
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get('username') || '';
  const room = searchParams.get('room') || '';
  const type = searchParams.get('type') || 'join'; // create / join

  // ⚡ State React
  const [socket, setSocket] = useState(null);
  const [players, setPlayers] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('');
  const [pointsToWin, setPointsToWin] = useState(100);
  const [timePerQuestion, setTimePerQuestion] = useState(30);

  const themes = ['Minecraft', 'HarryPotter', 'StarWars', 'Marvel', 'Geographie'];

  useEffect(() => {
    // 🔹 Background de la page
    document.body.style.backgroundColor = '#eef3ff';

    // ⚡ Vérifie token avant création de la socket
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Token manquant ! Connecte-toi d'abord.");
      navigate('/login');
      return;
    }

    // ⚡ Crée la socket
    const newSocket = io('https://server-rv2z.onrender.com', {
      transports: ['websocket', 'polling'],
      auth: { token }
    });

    // ⚡ Quand le socket se connecte
    newSocket.on('connect', () => {
      console.log("✅ Socket connecté :", newSocket.id);

      // 🔹 Créer ou rejoindre la room
      if (type === 'create') {
        newSocket.emit('createRoom', { room });
      } else {
        newSocket.emit('joinRoom', { room });
      }
    });

    // ⚡ Gestion des erreurs de connexion
    newSocket.on('connect_error', (err) => {
      console.error("Erreur socket :", err.message);
      alert("Erreur de connexion au serveur. Vérifie ton token ou le serveur.");
    });

    // ⚡ Mise à jour des joueurs connectés
    newSocket.on('updatePlayers', (list) => setPlayers(list));

    // ⚡ Messages du serveur
    newSocket.on('message', (msg) => console.log('💬', msg));

    // ⚡ Quand le serveur lance le jeu
    newSocket.on('launchGame', ({ selectedTheme, pointsToWin, timePerQuestion }) => {
      navigate('/startquizzmulti', {
        state: {
          selectedThemes: [selectedTheme],
          pointsToWin,
          timePerQuestion,
          username,
          room
        }
      });
    });

    // ⚡ Sauvegarde la socket dans le state
    setSocket(newSocket);

    // ⚡ Cleanup à la fermeture du composant
    return () => newSocket.disconnect();
  }, [username, room, type, navigate]);

  // 🔹 Fonction pour lancer la partie (uniquement si créateur)
  const handleStartGame = (e) => {
    e.preventDefault();
    if (!socket) return;
    if (!selectedTheme) return alert("Choisis un thème !");

    // 🔹 Envoi au serveur
    socket.emit('startGame', { room, theme: selectedTheme, pointsToWin, timePerQuestion });
  };

  return (
    <>
      {/* 🔹 CSS intégré */}
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #1e1e2f, #2c3e50);
        }
        .container {
          max-width: 700px;
          margin: 40px auto;
          background: #fff;
          padding: 40px 30px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(34, 17, 223, 0.1);
          text-align: center;
        }
        h1 { font-size: 28px; color: #0c00f6; margin-bottom: 20px; font-weight: bold; }
        .players { background: #e9f2ff; padding: 10px; border-radius: 8px; margin-bottom: 20px; }
        .players ul { list-style: none; padding: 0; }
        .players li { margin: 5px 0; font-weight: bold; color: #333; }
        select { padding: 10px; border-radius: 6px; border: none; margin-bottom: 10px; font-size: 16px; width: 100%; }
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
        button:hover { background: #0a00d0; }
        label { font-weight: bold; display: block; margin-top: 10px; margin-bottom: 5px; color: #333; }
      `}</style>

      {/* 🔹 HTML */}
      <div className="container">
        <h1>Salon Multijoueur : {room}</h1>
        <p><strong>Pseudo :</strong> {username}</p>

        <div className="players">
          <h3>👥 Joueurs connectés :</h3>
          <ul>{players.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>

        {/* 🔹 Créateur choisi les options */}
        {type === 'create' ? (
          <form onSubmit={handleStartGame}>
            <label>Thème :</label>
            <select value={selectedTheme} onChange={(e) => setSelectedTheme(e.target.value)} required>
              <option value="">-- Sélectionner --</option>
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <label>Points pour gagner :</label>
            <select value={pointsToWin} onChange={(e) => setPointsToWin(parseInt(e.target.value))}>
              {[50,100,150,200,250,300,350,400,450,500].map(v => <option key={v} value={v}>{v}</option>)}
            </select>

            <label>Temps par question :</label>
            <select value={timePerQuestion} onChange={(e) => setTimePerQuestion(parseInt(e.target.value))}>
              {[10,15,20,25,30,35,40,45,50,55,60].map(v => <option key={v} value={v}>{v} secondes</option>)}
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
