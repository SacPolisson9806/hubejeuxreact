import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function StartQuizzMulti() {
  const location = useLocation();
  const navigate = useNavigate();

  // ⚡ Récupération des infos depuis la page précédente
  const { selectedThemes, pointsToWin, timePerQuestion, username, room } = location.state || {};
  const selectedTheme = selectedThemes?.[0] || 'Minecraft';

  const socketRef = useRef(null);

  // ⚡ States React
  const [socketReady, setSocketReady] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [players, setPlayers] = useState([]);
  const [scores, setScores] = useState([]);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion || 30);

  // 🔹 Envoi d'un événement sécurisé au serveur
  const safeEmit = (event, payload) => {
    if (socketReady && socketRef.current) {
      socketRef.current.emit(event, payload);
    } else {
      console.warn(`⛔️ Socket non prêt pour l'événement "${event}"`);
    }
  };

  // ---------------------- Initialisation Socket ----------------------
  useEffect(() => {
    const newSocket = io('https://server-rv2z.onrender.com', {
      transports: ['polling'],
      upgrade: false,
      auth: { token: localStorage.getItem('token') }
    });

    socketRef.current = newSocket;

    // 🔹 Connection réussie
    newSocket.on('connect', () => {
      console.log('✅ Socket connecté :', newSocket.id);
      setSocketReady(true);

      // 🔹 Rejoindre la room
      safeEmit('joinGame', { room, username });
    });

    // 🔹 Mise à jour des joueurs
    newSocket.on('updatePlayers', (playerList) => {
      setPlayers(playerList);
    });

    // 🔹 Réception des questions depuis le serveur
    newSocket.on('startQuestions', ({ questions }) => {
      setQuestions(questions);
      setCurrentIndex(0);
      setCurrentQuestion(questions[0]);
      setTimeLeft(timePerQuestion);
      setUserAnswer('');
    });

    // 🔹 Affichage de la bonne réponse après chaque question
    newSocket.on('showAnswer', ({ correctAnswer }) => {
      setCorrectAnswer(correctAnswer);
      setShowAnswer(true);

      setTimeout(() => {
        setShowAnswer(false);
        const nextIndex = currentIndex + 1;
        if (nextIndex < questions.length) {
          setCurrentIndex(nextIndex);
          setCurrentQuestion(questions[nextIndex]);
          setTimeLeft(timePerQuestion);
          setUserAnswer('');
        } else {
          alert('✅ Fin du quiz !');
          navigate('/quizz'); // Retour au hub ou page finale
        }
      }, 3000); // 3 secondes pour montrer la réponse
    });

    // 🔹 Mise à jour des scores
    newSocket.on('scoreUpdate', (updatedScores) => {
      setScores(updatedScores);
    });

    // 🔹 Cleanup
    return () => newSocket.disconnect();
  }, [room, username, currentIndex, questions, navigate, timePerQuestion]);

  // ---------------------- Timer ----------------------
  useEffect(() => {
    if (!currentQuestion || showAnswer || !socketReady) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          safeEmit('timeout', { room, questionIndex: currentIndex });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion, showAnswer, socketReady, currentIndex, room]);

  // ---------------------- Soumission réponse ----------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer) return;

    safeEmit('submitAnswer', {
      room,
      username,
      questionIndex: currentIndex,
      answer: userAnswer
    });
    setUserAnswer('');
  };

  if (!currentQuestion) return <p style={{ textAlign: 'center' }}>Chargement des questions...</p>;

  return (
    <>
      {/* ---------------------- CSS ---------------------- */}
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1e1e2f, #2c3e50);
          color: #fff;
        }
        .container {
          background-color: #2c2c3c;
          padding: 40px 50px;
          border-radius: 16px;
          max-width: 600px;
          margin: 50px auto;
          text-align: center;
          box-shadow: 0 0 30px rgba(0,0,0,0.6);
        }
        h1 { color: #00bfff; margin-bottom: 20px; }
        p { margin: 5px 0; }
        .scores, .players { background: #1f1f2f; padding: 15px; border-radius: 10px; margin-bottom: 20px; }
        .scores h3, .players h3 { color: #00bfff; margin-bottom: 10px; }
        form { display: flex; flex-direction: column; gap: 10px; }
        label { font-weight: bold; text-align: left; color: #ccc; }
        input[type="text"], input[type="radio"] { padding: 10px; border-radius: 8px; border: none; background-color: #3c3c4c; color: #fff; }
        input:focus { outline: none; box-shadow: 0 0 8px #00bfff; }
        button { padding: 14px; background-color: #00bfff; color: #fff; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; }
        button:hover { background-color: #0099cc; transform: scale(1.05); }
        img { max-width: 300px; margin-bottom: 10px; border-radius: 10px; }
      `}</style>

      {/* ---------------------- Contenu ---------------------- */}
      <div className="container">
        <h1>Quiz Multijoueur : {selectedTheme}</h1>
        <p>Temps restant : {timeLeft} secondes</p>

        <div className="scores">
          <h3>Scores :</h3>
          <ul>{scores.map((p, i) => <li key={i}>{p.username} : {p.score} pts</li>)}</ul>
        </div>

        <div className="players">
          <h3>👥 Joueurs connectés :</h3>
          <ul>{players.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>

        {showAnswer ? (
          <p>✅ La bonne réponse était : <strong>{Array.isArray(correctAnswer) ? correctAnswer.join(' / ') : correctAnswer}</strong></p>
        ) : (
          <form onSubmit={handleSubmit}>
            {currentQuestion.image && <img src={`/${currentQuestion.image}`} alt="question" />}
            <p>{currentQuestion.question}</p>

            {Array.isArray(currentQuestion.options) ? (
              currentQuestion.options.map((opt, i) => (
                <label key={i}>
                  <input type="radio" name="answer" value={opt} checked={userAnswer === opt} onChange={(e) => setUserAnswer(e.target.value)} required /> {opt}
                </label>
              ))
            ) : (
              <input type="text" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} required />
            )}

            <button type="submit">Valider</button>
          </form>
        )}
      </div>
    </>
  );
}
