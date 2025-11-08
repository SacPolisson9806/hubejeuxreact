import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function JeuPendu() {
  const navigate = useNavigate();

  const [wordList, setWordList] = useState([]);
  const [word, setWord] = useState('');
  const [guessed, setGuessed] = useState([]);
  const [tries, setTries] = useState(0);
  const [message, setMessage] = useState(null);

  // 🔹 Chargement du fichier texte contenant les mots français
  useEffect(() => {
    fetch('/bibliotheque/liste_francais.txt')
      .then((res) => {
        if (!res.ok) {
          throw new Error('❌ Fichier liste_francais.txt introuvable');
        }
        return res.text();
      })
      .then((text) => {
        // Si le texte contient des balises HTML, on les ignore (cas "device-width")
        if (text.includes('<') || text.includes('>')) {
          throw new Error('❌ Le fichier contient du HTML au lieu de mots.');
        }

        const words = text
          .split(/\r?\n/) // découpe sur les retours à la ligne
          .map((w) => w.trim().toLowerCase())
          .filter(
            (w) =>
              w.length > 0 &&
              /^[a-zàâçéèêëîïôûùüÿñæœ-]+$/i.test(w) // uniquement lettres FR
          );

        if (words.length === 0) {
          throw new Error('❌ Aucun mot valide trouvé dans le fichier.');
        }

        setWordList(words);
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setWord(randomWord);
        console.log('✅ Mot choisi :', randomWord);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Erreur : impossible de charger les mots français 😢");
      });
  }, []);

  const handleGuess = (letter) => {
    if (guessed.includes(letter) || message) return;

    setGuessed((prev) => [...prev, letter]);

    if (!word.includes(letter)) {
      setTries((prev) => prev + 1);
    }
  };

  const displayWord = word
    .split('')
    .map((char) => (guessed.includes(char) ? char : '_'))
    .join(' ');

  const won = word && word.split('').every((char) => guessed.includes(char));
  const lost = tries >= 6;

  useEffect(() => {
    if (won) {
      setMessage('🎉 Félicitations ! Vous avez gagné !');
    } else if (lost) {
      setMessage(`💀 Vous avez perdu ! Le mot était : ${word}`);
    }
  }, [won, lost, word]);

  const handleReplay = () => {
    window.location.reload();
  };

  useEffect(() => {
    document.body.style.background = 'linear-gradient(to bottom, #1a1a1a, #000)';
    document.body.style.fontFamily = "'Orbitron', sans-serif";
    document.body.style.color = '#f0f0f0';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.height = '100vh';
  }, []);

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          background-color: #111;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(0,255,255,0.2);
          text-align: center;
          width: 90%;
          max-width: 600px;
        }

        h1 {
          color: #00ffff;
          text-shadow: 0 0 10px #00ffff;
          margin-bottom: 20px;
        }

        .word {
          font-size: 2.5em;
          letter-spacing: 15px;
          margin-bottom: 30px;
          color: #00ffff;
          text-shadow: 0 0 8px #00ffff;
        }

        form button {
          margin: 5px;
          padding: 12px 18px;
          font-size: 18px;
          border: none;
          border-radius: 6px;
          background-color: #222;
          color: #00ffff;
          box-shadow: 0 0 5px #00ffff;
          cursor: pointer;
          transition: transform 0.2s, background 0.3s;
        }

        form button:hover {
          transform: scale(1.05);
          background-color: #00ffff;
          color: #000;
        }

        form button:disabled {
          background-color: #555;
          color: #999;
          box-shadow: none;
          cursor: not-allowed;
        }

        .message {
          font-size: 1.5em;
          margin-bottom: 20px;
          color: #ff4444;
          text-shadow: 0 0 5px #ff4444;
        }

        .button {
          padding: 10px 20px;
          background-color: #00ffff;
          color: #000;
          border: none;
          border-radius: 6px;
          font-size: 1em;
          cursor: pointer;
          transition: background 0.3s;
          display: inline-block;
          margin-top: 30px;
        }

        .button:hover {
          background-color: #00cccc;
        }

        .footer {
          margin-top: 40px;
          text-align: center;
          color: #888;
          font-size: 0.9em;
        }
      `}</style>

      <div className="container">
        <h1>Jeu du Pendu</h1>

        {message ? (
          <>
            <p className="message">{message}</p>
            <button className="button" onClick={handleReplay}>
              🔁 Rejouer
            </button>
          </>
        ) : word ? (
          <>
            <p className="word">{displayWord}</p>
            <p>Essais restants : {6 - tries}</p>
            <form>
              {Array.from({ length: 26 }, (_, i) =>
                String.fromCharCode(97 + i)
              ).map((letter) => (
                <button
                  key={letter}
                  type="button"
                  disabled={guessed.includes(letter)}
                  onClick={() => handleGuess(letter)}
                >
                  {letter}
                </button>
              ))}
            </form>
          </>
        ) : (
          <p>Chargement des mots français...</p>
        )}

        <div className="footer">
          <button className="button" onClick={() => navigate('/hubjeux')}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    </>
  );
}
