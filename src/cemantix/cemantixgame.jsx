import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cemantixgame() {
  const navigate = useNavigate();

  const [motMystere, setMotMystere] = useState('');
  const [motPropose, setMotPropose] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch('/bibliotheque.json')
      .then((res) => res.json())
      .then((data) => {
        const mots = Object.keys(data);
        const mot = mots[Math.floor(Math.random() * mots.length)];
        setMotMystere(mot);
        console.log('Mot mystère :', mot);
      });
  }, []);

  const checkWord = () => {
    const mot = motPropose.trim().toLowerCase();
    if (!mot || !motMystere) return;

    fetch('https://hubejeux.onrender.com/similarity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word1: mot, word2: motMystere })
    })
      .then((res) => res.json())
      .then((data) => afficherScore(mot, data.score))
      .catch((err) => {
        console.error('Erreur backend :', err);
        afficherScore(mot, 0);
      });

    setMotPropose('');
  };

  const afficherScore = (mot, score) => {
    let couleur = '🔵';
    if (score >= 0.8) couleur = '🔴';
    else if (score >= 0.5) couleur = '🟡';

    const entry = {
      mot,
      score: score.toFixed(3),
      couleur,
      victoire: mot === motMystere
    };

    setHistory((prev) => [...prev, entry]);
  };

  const goBack = () => {
    navigate('/cemantix');
  };

  // 🔧 Appliquer le style global au body
  useEffect(() => {
    document.body.style.fontFamily = "'Courier New', Courier, monospace";
    document.body.style.backgroundColor = '#fdf6e3';
    document.body.style.color = '#333';
    document.body.style.textAlign = 'center';
    document.body.style.padding = '40px';
  }, []);

  return (
    <>
      {/* 🔸 Style intégré */}
      <style>{`
        h1 {
          font-size: 36px;
          margin-bottom: 10px;
          color: #2e7d32;
        }

        p {
          font-size: 18px;
          margin-bottom: 20px;
        }

        .rules, .difficulty {
          background-color: #fff;
          border: 2px dashed #ccc;
          padding: 20px;
          margin: 20px auto;
          border-radius: 12px;
          max-width: 600px;
          box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
        }

        ul {
          list-style-type: none;
          padding: 0;
        }

        ul li {
          font-size: 16px;
          margin: 8px 0;
        }

        input[type="text"] {
          padding: 12px 16px;
          font-size: 20px;
          border-radius: 8px;
          border: 2px solid #2e7d32;
          background-color: #fefefe;
          color: #333;
          width: 250px;
          text-align: center;
        }

        input[type="text"]::placeholder {
          color: #aaa;
        }

        button {
          padding: 12px 20px;
          font-size: 18px;
          border-radius: 8px;
          border: none;
          background-color: #2e7d32;
          color: #fff;
          cursor: pointer;
          margin: 10px;
          transition: background-color 0.3s ease;
        }

        button:hover {
          background-color: #388e3c;
        }

        #history {
          margin-top: 30px;
          font-size: 16px;
          text-align: left;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          background-color: #fff;
          border: 1px solid #ccc;
          padding: 20px;
          border-radius: 8px;
        }
      `}</style>

      <div className="container">
        <h1>🎮 Cemantix</h1>
        <p>Devine le mot mystère !</p>

        <input
          type="text"
          id="wordInput"
          placeholder="Propose un mot"
          value={motPropose}
          onChange={(e) => setMotPropose(e.target.value)}
        />
        <button onClick={checkWord}>Essayer</button>
        <br /><br />
        <button onClick={goBack}>Retour à l’accueil</button>

        <div id="history">
          {history.map((entry, index) => (
            <div key={index}>
              👉 {entry.mot} → Score : {entry.score} {entry.couleur}
              {entry.victoire && <h2>🎉 Bravo ! Mot trouvé !</h2>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
