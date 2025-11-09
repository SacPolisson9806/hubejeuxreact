import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function JeuPendu() {
  const navigate = useNavigate();

  // 🔹 États du jeu
  const [wordList, setWordList] = useState([]); // liste des mots chargés depuis le fichier
  const [word, setWord] = useState(''); // mot actuel à deviner
  const [guessed, setGuessed] = useState([]); // lettres déjà proposées par le joueur
  const [tries, setTries] = useState(0); // nombre d’erreurs
  const [message, setMessage] = useState(null); // message de victoire/défaite

  // 🔹 Gestion des lettres accentuées (pour rendre le jeu plus "français")
  const accentsMap = {
    a: ['a', 'à', 'â', 'ä', 'ã', 'å'],
    e: ['e', 'é', 'è', 'ê', 'ë'],
    i: ['i', 'î', 'ï', 'í'],
    o: ['o', 'ô', 'ö', 'ò', 'õ'],
    u: ['u', 'ù', 'û', 'ü'],
    c: ['c', 'ç'],
    y: ['y', 'ÿ']
  };

  // 🔹 Au chargement, on lit le fichier texte contenant les mots français
  useEffect(() => {
    fetch('/bibliotheque/liste_francais.txt')
      .then((res) => {
        if (!res.ok) {
          throw new Error('❌ Fichier liste_francais.txt introuvable');
        }
        return res.text();
      })
      .then((text) => {
        // Vérifie que le fichier ne contient pas de HTML
        if (text.includes('<') || text.includes('>')) {
          throw new Error('❌ Le fichier contient du HTML au lieu de mots.');
        }

        // Nettoie et filtre les mots valides
        const words = text
          .split(/\r?\n/)
          .map((w) => w.trim().toLowerCase())
          .filter((w) => w.length > 0 && /^[a-zàâçéèêëîïôûùüÿñæœ-]+$/i.test(w));

        if (words.length === 0) {
          throw new Error('❌ Aucun mot valide trouvé dans le fichier.');
        }

        // Stocke la liste et choisit un mot au hasard
        setWordList(words);
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setWord(randomWord);
      })
      .catch((err) => {
        console.error(err);
        setMessage("Erreur : impossible de charger les mots français 😢");
      });
  }, []);

  // 🔹 Fonction appelée quand l’utilisateur clique sur une lettre
  const handleGuess = (letter) => {
    // Si la lettre a déjà été proposée ou qu’une fin de partie est affichée → on ne fait rien
    if (guessed.includes(letter) || message) return;

    // Ajoute la lettre à la liste des lettres testées
    setGuessed((prev) => [...prev, letter]);

    // Vérifie si cette lettre (ou ses variantes accentuées) est dans le mot
    const possibleLetters = accentsMap[letter] || [letter];
    if (!word.split('').some((char) => possibleLetters.includes(char))) {
      // Si elle n’est pas dedans → on compte un essai raté
      setTries((prev) => prev + 1);
    }
  };

  // 🔹 Génère l’affichage du mot avec les lettres trouvées et les "_"
  const displayWord = word
    .split('')
    .map((char) => {
      // Vérifie si le caractère fait partie des lettres trouvées (même avec accent)
      const guessedMatch = guessed.some((letter) =>
        (accentsMap[letter] || [letter]).includes(char)
      );
      return guessedMatch ? char : '_';
    })
    .join(' ');

  // 🔹 Vérifie les conditions de victoire ou défaite
  const won =
    word &&
    word
      .split('')
      .every((char) =>
        guessed.some((letter) => (accentsMap[letter] || [letter]).includes(char))
      );
  const lost = tries >= 6;

  // 🔹 Affiche un message quand le joueur gagne ou perd
  useEffect(() => {
    if (won) {
      setMessage(`🎉 Félicitations ! Vous avez gagné ! Le mot était : ${word}`);
    } else if (lost) {
      setMessage(`💀 Vous avez perdu ! Le mot était : ${word}`);
    }
  }, [won, lost, word]);

  // 🔹 Permet de relancer une partie sans recharger la page
  const handleReplay = () => {
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    setWord(randomWord);
    setGuessed([]);
    setTries(0);
    setMessage(null);
  };

  // 🔹 Définit le style général du fond de page (effet néon futuriste)
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
      {/* 💅 Styles CSS internes */}
      <style>{`
        * {margin:0;padding:0;box-sizing:border-box;}
        .container {
          background-color: #111;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(0,255,255,0.2);
          text-align: center;
          width: 90%;
          max-width: 600px;
        }
        h1 {color: #00ffff;text-shadow: 0 0 10px #00ffff;margin-bottom: 20px;}
        .word {
          font-size: 2em;
          letter-spacing: 10px;
          margin-bottom: 20px;
          color: #00ffff;
          text-shadow: 0 0 8px #00ffff;
          word-wrap: break-word;
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
        form button:hover {transform: scale(1.05);background-color: #00ffff;color: #000;}
        form button:disabled {background-color: #555;color: #999;box-shadow:none;cursor:not-allowed;}
        .message {font-size: 1.5em;margin-bottom: 20px;color: #ff4444;text-shadow: 0 0 5px #ff4444;}
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
        .button:hover {background-color: #00cccc;}
        .footer {margin-top: 40px;text-align: center;color: #888;font-size: 0.9em;}
      `}</style>

      {/* 🎮 Conteneur principal du jeu */}
      <div className="container">
        <h1>Jeu du Pendu</h1>

        {/* 🔹 Affichage selon l’état du jeu (message, mot ou chargement) */}
        {message ? (
          <>
            {/* Message de victoire ou défaite */}
            <p className="message">{message}</p>
            <button className="button" onClick={handleReplay}>
              🔁 Rejouer
            </button>
          </>
        ) : word ? (
          <>
            {/* Affichage du mot et des essais restants */}
            <p className="word">{displayWord}</p>
            <p>Essais restants : {6 - tries}</p>

            {/* Clavier virtuel avec les lettres de l’alphabet */}
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
          // Message de chargement pendant la lecture du fichier
          <p>Chargement des mots français...</p>
        )}

        {/* 🔙 Bouton retour vers le hub des jeux */}
        <div className="footer">
          <button className="button" onClick={() => navigate('/hubjeux')}>
            Retour à l'accueil
          </button>
        </div>
      </div>
    </>
  );
}
