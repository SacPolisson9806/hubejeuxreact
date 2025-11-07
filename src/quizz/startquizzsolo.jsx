import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function StartQuizzSolo() {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedThemes, pointsToWin, timePerQuestion } = location.state || {};
  const [questions, setQuestions] = useState([]);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Charger les questions du thème en cours
  useEffect(() => {
  const loadQuestions = async () => {
    try {
      const theme = selectedThemes[currentThemeIndex];
      const response = await fetch(`/${theme}.json`);
      if (!response.ok) {
        throw new Error(
          `Impossible de charger le fichier JSON pour le thème "${theme}".`
        );
      }
      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error(`Le fichier JSON pour le thème "${theme}" est vide ou invalide.`);
      }

      // Mélanger les questions
      const shuffled = data.sort(() => Math.random() - 0.5);

      setQuestions(shuffled);
      setIndex(0);
      setCurrentQuestion(shuffled[0]);
      setTimeLeft(timePerQuestion);
    } catch (error) {
      console.error('Erreur de chargement des questions :', error);
      alert(`Erreur de chargement des questions : ${error.message}`);
    }
  };

  if (selectedThemes && selectedThemes.length > 0) {
    loadQuestions();
  }
}, [currentThemeIndex, selectedThemes, timePerQuestion]);

const [inputError, setInputError] = useState('');

  // Timer
  useEffect(() => {
    if (!currentQuestion || showAnswer) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion, showAnswer]);

  const handleTimeOut = () => {
    setShowAnswer(true);
    setCorrectAnswer(currentQuestion.answer);
    setTimeout(nextQuestion, 3000);
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const isInputQuestion = !Array.isArray(currentQuestion.options);

  const correct =
    Array.isArray(currentQuestion.answer)
      ? currentQuestion.answer.includes(userAnswer.trim())
      : userAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase();

  if (isInputQuestion && !correct && timeLeft > 0) {
    // Réponse incorrecte pour input → afficher message et continuer
    setInputError('❌ Mauvaise réponse, essayez encore.');
    setUserAnswer('');
    return; // ne passe pas à la question suivante
  }

  // Réponse correcte ou question à choix multiple
  setShowAnswer(true);
  setCorrectAnswer(currentQuestion.answer);

  if (correct) {
    let scoreForThisQuestion = Math.ceil((timeLeft / timePerQuestion) * 10);
    if (timeLeft === timePerQuestion) scoreForThisQuestion += 2; // bonus pour réponse immédiate
    setScore((prev) => prev + scoreForThisQuestion);
  }

  setInputError(''); // réinitialiser l'erreur
  setTimeout(nextQuestion, 3000);
};


  const nextQuestion = () => {
    setShowAnswer(false);
    setUserAnswer('');
    setTimeLeft(timePerQuestion);

    const nextIndex = index + 1;
    if (nextIndex < questions.length) {
      setIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
    } else if (currentThemeIndex + 1 < selectedThemes.length) {
      setCurrentThemeIndex((prev) => prev + 1);
    } else {
      alert(`🎉 Fin du quiz !\nScore final : ${score} points`);
      navigate('/quizz');
    }
  };

  if (!currentQuestion)
    return <p style={{ textAlign: 'center' }}>Chargement des questions...</p>;

  return (
    <>
  <div className="container">
    <h1>🎯 Quiz Solo - {selectedThemes[currentThemeIndex]}</h1>
    <p>Score : {score} / {pointsToWin}</p>
    <p>Temps restant : {timeLeft} secondes</p>

    {showAnswer ? (
      <p>
        ✅ La bonne réponse était :{' '}
        <strong>
          {Array.isArray(correctAnswer)
            ? correctAnswer.join(' / ')
            : correctAnswer}
        </strong>
      </p>
    ) : (
      <form onSubmit={handleSubmit}>
        {currentQuestion.image && (
          <img
            src={`/${currentQuestion.image}`}
            alt="question"
            className="question-image"
          />
        )}
        <p>{currentQuestion.question}</p>

        {Array.isArray(currentQuestion.options) ? (
          // Questions à choix multiple
          currentQuestion.options.map((opt, i) => (
            <label key={i}>
              <input
                type="radio"
                name="answer"
                value={opt}
                onChange={(e) => setUserAnswer(e.target.value)}
                required
              />{' '}
              {opt}
            </label>
          ))
        ) : (
          // Questions input (saisie libre)
          <>
            <input
              type="text"
              name="answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              required
            />
            {inputError && (
              <p style={{ color: 'red', fontWeight: 'bold' }}>{inputError}</p>
            )}
          </>
        )}

        <button type="submit">Valider</button>
      </form>
    )}
  </div>

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

        h1 {
          font-size: 28px;
          margin-bottom: 20px;
          color: #00bfff;
        }

        p {
          font-size: 16px;
          margin-bottom: 10px;
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

        .question-image {
          max-width: 300px;
          margin-bottom: 10px;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}
