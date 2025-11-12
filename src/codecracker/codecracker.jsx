// src/pages/CodeCracker.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function CodeCracker() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const digitCount = parseInt(searchParams.get('digits')) || 4;

  const [secret, setSecret] = useState([]);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [won, setWon] = useState(false);

  useEffect(() => {
    const newSecret = [];
    while (newSecret.length < digitCount) {
      const digit = Math.floor(Math.random() * 10);
      if (!newSecret.includes(digit)) newSecret.push(digit);
    }
    setSecret(newSecret);
  }, [digitCount]);

  const checkGuess = () => {
    if (guess.length !== digitCount || isNaN(guess)) return;

    const guessDigits = guess.split('').map(Number);
    let result = '';

    guessDigits.forEach((digit, i) => {
      if (digit === secret[i]) result += `<span class="green">🟢</span>`;
      else if (secret.includes(digit)) result += `<span class="yellow">🟡</span>`;
      else result += `<span class="red">🔴</span>`;
    });

    setAttempts((prev) => [...prev, { input: guess, result }]);
    setGuess('');

    if (guessDigits.every((d, i) => d === secret[i])) setWon(true);
  };

  const goBack = () => navigate('/codecrackerindex');

  return (
    <div className="container">
      <h1 className="title">🎮 Code Cracker</h1>
      <p id="instructions">Devine le code secret à {digitCount} chiffres</p>

      {!won ? (
        <>
          <input
            type="text"
            id="guessInput"
            placeholder={`Ex: ${'1'.repeat(digitCount)}`}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
          />
          <button onClick={checkGuess}>Essayer</button>
        </>
      ) : (
        <h2 className="win-message">🎉 Bravo ! Code trouvé !</h2>
      )}

      {/* 📊 Tableau scrollable */}
      {attempts.length > 0 && (
        <div className="table-container">
          <h3>Historique des tentatives</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tentative</th>
                <th>Résultat</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{attempt.input}</td>
                  <td dangerouslySetInnerHTML={{ __html: attempt.result }}></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔘 Bouton Retour fixé */}
      <div className="bottom">
        <button onClick={goBack}>Retour à l’accueil</button>
      </div>

      <style>{`
        body {
          font-family: 'Segoe UI', sans-serif;
          margin: 0;
          padding: 0;
          height: 100vh;
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          color: #fff;
          overflow: hidden; /* pas de scroll global */
        }

        .container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          align-items: center;
          padding: 20px;
          box-sizing: border-box;
        }

        .title {
          font-size: 2.8rem;
          margin-bottom: 10px;
          text-shadow: 2px 2px 6px rgba(0,0,0,0.5);
        }

        #instructions {
          font-size: 1.2rem;
          margin-bottom: 20px;
          color: #ddd;
        }

        input[type="text"] {
          padding: 16px;
          font-size: 24px;
          border-radius: 12px;
          border: 2px solid #4caf50;
          background-color: #1e1e1e;
          color: #fff;
          text-align: center;
          letter-spacing: 10px;
          width: 250px;
          margin-bottom: 15px;
        }

        button {
          padding: 14px 28px;
          font-size: 18px;
          border-radius: 12px;
          border: none;
          background-color: #4caf50;
          color: #fff;
          cursor: pointer;
          transition: transform 0.2s ease, background-color 0.3s ease;
          margin: 5px;
        }
        button:hover { transform: scale(1.05); background-color: #66bb6a; }

        .win-message {
          font-size: 2rem;
          color: #ffeb3b;
          text-shadow: 2px 2px 10px rgba(0,0,0,0.5);
        }

        /* 📊 Tableau scrollable */
        .table-container {
          width: 100%;
          flex: 1 1 auto;
          overflow-y: auto; /* scroll si dépasse */
          margin-bottom: 80px; /* espace pour le bouton */
          padding: 10px;
          background-color: rgba(30,30,30,0.8);
          border-radius: 10px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 12px 16px;
          text-align: center;
          border-bottom: 1px solid rgba(76,175,80,0.3);
        }

        th { background-color: rgba(76,175,80,0.2); font-weight: bold; }
        td span.green { color: #4caf50; }
        td span.yellow { color: #ffeb3b; }
        td span.red { color: #f44336; }

        /* 🔘 Bouton Retour fixé en bas */
        .bottom {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(to top, #121212 0%, transparent 50%);
        }

        @media (max-width: 500px) {
          input[type="text"] { width: 80%; font-size: 20px; letter-spacing: 6px; }
          button { width: 45%; font-size: 16px; }
          th, td { padding: 10px; font-size: 14px; }
        }
      `}</style>
    </div>
  );
}
