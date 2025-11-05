// src/pages/CodeCracker.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './codecracker.css'; // Ton fichier CSS

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
    </div>
  );
}
