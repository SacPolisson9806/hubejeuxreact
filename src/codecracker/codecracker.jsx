// src/pages/CodeCracker.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function CodeCracker() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 🔹 Nombre de chiffres à deviner (ex: 4)
  const digitCount = parseInt(searchParams.get('digits')) || 4;

  // 🔹 États du jeu
  const [secret, setSecret] = useState([]);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState([]);
  const [won, setWon] = useState(false);

  // 🔹 Génère un code secret unique
  useEffect(() => {
    const newSecret = [];
    while (newSecret.length < digitCount) {
      const digit = Math.floor(Math.random() * 10);
      if (!newSecret.includes(digit)) newSecret.push(digit);
    }
    setSecret(newSecret);
  }, [digitCount]);

  // 🔹 Vérifie la tentative
  const checkGuess = () => {
    if (guess.length !== digitCount || isNaN(guess)) return;

    const guessDigits = guess.split('').map(Number);
    let result = '';

    guessDigits.forEach((digit, i) => {
      if (digit === secret[i]) {
        result += `<span class="green">🟢</span>`;
      } else if (secret.includes(digit)) {
        result += `<span class="yellow">🟡</span>`;
      } else {
        result += `<span class="red">🔴</span>`;
      }
    });

    const newAttempt = {
      input: guess,
      result
    };

    setAttempts((prev) => [...prev, newAttempt]);
    setGuess('');

    if (guessDigits.every((d, i) => d === secret[i])) {
      setWon(true);
    }
  };

  // 🔹 Retour à l’accueil
  const goBack = () => {
    navigate('/codecrackerindex');
  };

  return (
    <div className="container">
      <h1>🎮 Code Cracker</h1>
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
        <h2>🎉 Bravo ! Code trouvé !</h2>
      )}

      <div className="feedback" id="feedback">
        {attempts.map((attempt, i) => (
          <div key={i} className="attempt" dangerouslySetInnerHTML={{ __html: `👉 ${attempt.input} → ${attempt.result}` }} />
        ))}
      </div>

      <br /><br />
      <button onClick={goBack}>Retour à l’accueil</button>

      {/* 🔹 CSS intégré */}
      <style>{`
        body {
          font-family: 'Segoe UI', sans-serif;
          background: #121212;
          color: #fff;
          text-align: center;
          padding: 40px;
        }

        .container {
          max-width: 700px;
          margin: auto;
        }

        select {
          padding: 12px 16px;
          font-size: 18px;
          border-radius: 10px;
          border: 2px solid #4caf50;
          background-color: #1e1e1e;
          color: #fff;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        select:hover {
          border-color: #81c784;
          background-color: #2c2c2c;
        }

        button {
          padding: 12px 20px;
          font-size: 18px;
          border-radius: 10px;
          border: none;
          background-color: #4caf50;
          color: #fff;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin: 5px;
        }

        button:hover {
          background-color: #66bb6a;
        }

        .rules, .difficulty, .feedback {
          margin-top: 20px;
          padding: 16px;
          background-color: #1a1a1a;
          border-radius: 8px;
          box-shadow: 0 0 6px rgba(76, 175, 80, 0.2);
        }

        ul {
          list-style: none;
          padding: 0;
        }

        ul li {
          margin: 8px 0;
          font-size: 16px;
        }

        input[type="text"] {
          padding: 12px 16px;
          font-size: 20px;
          border-radius: 10px;
          border: 2px solid #4caf50;
          background-color: #1e1e1e;
          color: #fff;
          text-align: center;
          letter-spacing: 8px;
          width: 200px;
          transition: all 0.3s ease;
        }

        input[type="text"]::placeholder {
          color: #888;
          letter-spacing: normal;
        }

        input[type="text"]:focus {
          outline: none;
          border-color: #81c784;
          background-color: #2c2c2c;
        }

        .green { color: #4caf50; }
        .yellow { color: #ffeb3b; }
        .red { color: #f44336; }

        .attempt {
          margin: 6px 0;
          font-size: 18px;
        }
      `}</style>
    </div>
  );
}
