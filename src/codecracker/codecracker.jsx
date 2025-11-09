// src/pages/CodeCracker.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function CodeCracker() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 🔹 Récupère le nombre de chiffres à deviner depuis l’URL (par défaut : 4)
  const digitCount = parseInt(searchParams.get('digits')) || 4;

  // 🔹 États du jeu
  const [secret, setSecret] = useState([]);     // Le code secret à deviner
  const [guess, setGuess] = useState('');       // La tentative actuelle saisie par le joueur
  const [attempts, setAttempts] = useState([]); // Historique des tentatives précédentes
  const [won, setWon] = useState(false);        // Statut de victoire

  // 🔹 Génère un code secret unique à chaque partie
  useEffect(() => {
    const newSecret = [];
    while (newSecret.length < digitCount) {
      const digit = Math.floor(Math.random() * 10);
      if (!newSecret.includes(digit)) newSecret.push(digit); // empêche les doublons
    }
    setSecret(newSecret);
  }, [digitCount]);

  // 🔹 Vérifie la tentative du joueur et produit un feedback coloré
  const checkGuess = () => {
    if (guess.length !== digitCount || isNaN(guess)) return; // Vérifie la validité de l’entrée

    const guessDigits = guess.split('').map(Number); // Convertit la saisie en tableau de nombres
    let result = '';

    // 🔸 Compare chaque chiffre avec le code secret
    guessDigits.forEach((digit, i) => {
      if (digit === secret[i]) {
        result += `<span class="green">🟢</span>`; // Bon chiffre et bonne position
      } else if (secret.includes(digit)) {
        result += `<span class="yellow">🟡</span>`; // Bon chiffre, mauvaise position
      } else {
        result += `<span class="red">🔴</span>`; // Chiffre absent du code
      }
    });

    // Enregistre la tentative et son résultat
    const newAttempt = {
      input: guess,
      result
    };

    setAttempts((prev) => [...prev, newAttempt]); // Ajoute à la liste des tentatives
    setGuess(''); // Réinitialise le champ de saisie

    // 🔹 Vérifie la victoire
    if (guessDigits.every((d, i) => d === secret[i])) {
      setWon(true);
    }
  };

  // 🔹 Retour à la page d’accueil du jeu
  const goBack = () => {
    navigate('/codecrackerindex');
  };

  return (
    <div className="container">
      <h1>🎮 Code Cracker</h1>
      <p id="instructions">Devine le code secret à {digitCount} chiffres</p>

      {/* 🧩 Zone de jeu principale */}
      {!won ? (
        <>
          {/* Champ de saisie du code */}
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
        // 🎉 Message de victoire
        <h2>🎉 Bravo ! Code trouvé !</h2>
      )}

      {/* 📜 Zone d’affichage des essais précédents */}
      <div className="feedback" id="feedback">
        {attempts.map((attempt, i) => (
          <div
            key={i}
            className="attempt"
            dangerouslySetInnerHTML={{
              __html: `👉 ${attempt.input} → ${attempt.result}`
            }}
          />
        ))}
      </div>

      <br /><br />
      {/* Bouton de retour */}
      <button onClick={goBack}>Retour à l’accueil</button>

      {/* 🎨 Styles CSS intégrés */}
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

        /* Sélecteurs et boutons */
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

        /* Sections d’affichage */
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

        /* Champ de saisie du code */
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

        /* 🟢🟡🔴 Couleurs des résultats */
        .green { color: #4caf50; }
        .yellow { color: #ffeb3b; }
        .red { color: #f44336; }

        /* Liste des tentatives */
        .attempt {
          margin: 6px 0;
          font-size: 18px;
        }
      `}</style>
    </div>
  );
}
