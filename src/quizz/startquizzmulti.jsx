import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

export default function StartQuizzMulti() {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedThemes, pointsToWin, timePerQuestion, username, room } = location.state || {};
  const selectedTheme = selectedThemes?.[0] || "Minecraft";

  const socketRef = useRef(null);
  const [socketReady, setSocketReady] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [scores, setScores] = useState([]);
  const [players, setPlayers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion || 30);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    const newSocket = io('https://server-rv2z.onrender.com', {
      transports: ['polling'],
      upgrade: false
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log("✅ Socket connecté :", newSocket.id);
      setSocketReady(true);
      newSocket.emit('joinGame', { room, username });
    });

    newSocket.on('updatePlayers', (playerList) => {
      setPlayers(playerList);
    });

    newSocket.on('startQuestions', ({ questions }) => {
      setQuestions(questions);
      setCurrentQuestion(questions[0]);
      setIndex(0);
      setTimeLeft(timePerQuestion);
    });

    newSocket.on('showAnswer', ({ correctAnswer }) => {
      setCorrectAnswer(correctAnswer);
      setShowAnswer(true);
      setTimeout(() => {
        setShowAnswer(false);
        const nextIndex = index + 1;
        if (nextIndex < questions.length) {
          setIndex(nextIndex);
          setCurrentQuestion(questions[nextIndex]);
          setTimeLeft(timePerQuestion);
          setUserAnswer('');
        } else {
          alert('Fin du quiz !');
          navigate('/quizz');
        }
      }, 3000);
    });

    newSocket.on('scoreUpdate', (updatedScores) => {
      setScores(updatedScores);
    });

    return () => newSocket.disconnect();
  }, [room, username, navigate, timePerQuestion]);

  useEffect(() => {
    if (!currentQuestion || showAnswer || !socketReady || !socketRef.current) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (socketReady && socketRef.current) {
            socketRef.current.emit('timeout', { room, questionIndex: index });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQuestion, showAnswer, socketReady, room, index]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!socketReady || !socketRef.current) {
      console.warn("⚠️ socket pas prêt dans handleSubmit");
      return;
    }
    socketRef.current.emit('submitAnswer', {
      room,
      username,
      questionIndex: index,
      answer: userAnswer
    });
  };

  if (!currentQuestion) return <p style={{ textAlign: 'center' }}>Chargement des questions...</p>;

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
          min-height: 100vh;
        }

        .container {
          background-color: #2c2c3c;
          padding: 40px 50px;
          border-radius: 16px;
          box-shadow: 0 0 30px rgba(0,0,0,0.6);
          width: 100%;
          max-width: 600px;
          text-align: center;
          animation: fadeIn 0.6s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        h1 {
          font-size: 28px;
          margin-bottom: 20px;
          color: #00bfff;
        }

        p {
          font-size: 16px;
          margin-bottom: 10px;
        }

        .scores {
          background: #1f1f2f;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 25px;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.3);
        }

        .scores h3 {
          margin-bottom: 10px;
          color: #00bfff;
        }

        .scores ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .scores li {
          margin: 6px 0;
          font-weight: bold;
          color: #eee;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        label {
          font-weight: bold;
          text-align: left;
          color: #ccc;
        }

        input[type="text"], input[type="radio"] {
          padding: 10px;
          border: none;
          border-radius: 8px;
          background-color: #3c3c4c;
          color: #fff;
          font-size: 16px;
        }

        input:focus {
          outline: none;
          box-shadow: 0 0 8px #00bfff;
        }

        button {
          padding: 14px;
          background-color: #00bfff;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s ease, transform 0.2s ease;
        }

        button:hover {
          background-color: #0099cc;
          transform: scale(1.05);
        }

        img {
          max-width: 300px;
          margin-bottom: 10px;
          border-radius: 10px;
        }
      `}</style>

      <div className="container">
        <h1>Quiz Multijoueur : {selectedTheme}</h1>
        <p>Temps restant : {timeLeft} secondes</p>

        <div className="scores">
          <h3>Scores :</h3>
          <ul>
            {scores.map((p, i) => (
              <li key={i}>{p.username} : {p.score} pts</li>
            ))}
          </ul>
        </div>

        <div className="scores">
          <h3>👥 Joueurs connectés :</h3>
          <ul>
            {players.map((name, i) => (
              <li key={i}>{name}</li>
            ))}
          </ul>
        </div>

        {showAnswer ? (
          <p>✅ La bonne réponse était : <strong>{Array.isArray(correctAnswer) ? correctAnswer.join(' / ') : correctAnswer}</strong></p>
        ) : (
          <form onSubmit={handleSubmit}>
            {currentQuestion.image && (
              <img src={`/${currentQuestion.image}`} alt="question" />
            )}
            <p>{currentQuestion.question}</p>
            {Array.isArray(currentQuestion.options) ? (
              currentQuestion.options.map((opt, i) => (
                <label key={i}>
                  <input type="radio" name="answer" value={opt} required /> {opt}
                </label>
              ))
            ) : (
              <input
                type="text"
                name="answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                required
              />
            )}
            <button type="submit">Valider</button>
          </form>
        )}
      </div>
    </>
  );
}
