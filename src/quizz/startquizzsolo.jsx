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
  const [inputError, setInputError] = useState('');
  const [usedQuestions, setUsedQuestions] = useState([]);

  // Charger les questions du thème en cours
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const theme = selectedThemes[currentThemeIndex];
        const response = await fetch(`/${theme}.json`);
        if (!response.ok) {
          throw new Error(`Impossible de charger le fichier JSON pour le thème "${theme}".`);
        }
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error(`Le fichier JSON pour le thème "${theme}" est vide ou invalide.`);
        }

        // Mélanger et filtrer les questions déjà utilisées
        const shuffled = data
          .sort(() => Math.random() - 0.5)
          .filter((q) => !usedQuestions.some((u) => u.question === q.question));

        if (shuffled.length === 0) {
          alert("🎉 Tu as répondu à toutes les questions disponibles !");
          navigate('/quizz');
          return;
        }

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
  }, [currentThemeIndex, selectedThemes, timePerQuestion, usedQuestions, navigate]);

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

  // Supprimer les accents et normaliser la casse
  const normalizeAnswer = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isInputQuestion = !Array.isArray(currentQuestion.options);

    const userAnswerNormalized = normalizeAnswer(userAnswer);
    const correctAnswerNormalized = Array.isArray(currentQuestion.answer)
      ? currentQuestion.answer.map((ans) => normalizeAnswer(ans))
      : normalizeAnswer(currentQuestion.answer);

    const correct = Array.isArray(currentQuestion.answer)
      ? correctAnswerNormalized.includes(userAnswerNormalized)
      : correctAnswerNormalized === userAnswerNormalized;

    if (isInputQuestion && !correct && timeLeft > 0) {
      setInputError('❌ Mauvaise réponse, essayez encore.');
      setUserAnswer('');
      return;
    }

    setShowAnswer(true);
    setCorrectAnswer(currentQuestion.answer);

    let scoreForThisQuestion = 0;
    if (correct) {
      scoreForThisQuestion = Math.ceil((timeLeft / timePerQuestion) * 10);
      if (timeLeft === timePerQuestion) scoreForThisQuestion += 2;
      const newScore = score + scoreForThisQuestion;

      // ✅ Vérifie victoire ici AVANT de mettre à jour le state
      if (newScore >= pointsToWin) {
        alert(`🏆 Bravo ! Tu as atteint ${newScore} points et remporté la partie !`);
        navigate('/quizz');
        return;
      }

      setScore(newScore);
    }

    setInputError('');
    setTimeout(nextQuestion, 3000);
  };

  const nextQuestion = () => {
    setShowAnswer(false);
    setUserAnswer('');
    setTimeLeft(timePerQuestion);

    // 🧠 Marquer la question actuelle comme "utilisée"
    setUsedQuestions((prev) => [...prev, currentQuestion]);

    const nextIndex = index + 1;
    if (nextIndex < questions.length) {
      setIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);
    } else if (currentThemeIndex + 1 < selectedThemes.length) {
      setCurrentThemeIndex((prev) => prev + 1);
    } else {
      alert(`🎉 Fin du quiz !\nScore final : ${score} points`);
      navigate('/quizzsolo');
    }
  };

  if (!currentQuestion)
    return <p style={{ textAlign: 'center' }}>Chargement des questions...</p>;

  return (
  <>
  <div
    className="quiz-background"
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `url(/background/${selectedThemes[currentThemeIndex]}.jpg)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      animation: 'pan 60s linear infinite',
      zIndex: -1, // derrière tout le contenu
    }}
  />
  <div className="quiz-wrapper">
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
            <div className="question-image-wrapper">
              <img
                src={`${currentQuestion.image}`}
                alt="question"
                className="question-image"
              />
            </div>
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
            <div className="input-wrapper">
              <input
                type="text"
                name="answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                required
                autoComplete="off"
                spellCheck={false}
              />
              {inputError && (
                <p className="input-error">{inputError}</p>
              )}
            </div>
          )}

          <button type="submit">Valider</button>
        </form>
      )}
    </div>
  </div>

  <style>{`
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #fff;
    }

    @keyframes pan {
      0% { background-position: 0% center; }
      100% { background-position: 100% center; }
    }

    .quiz-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh; /* plein écran */
      width: 100%;
      position: relative;
      z-index: 1;
    }

    .container {
      background-color: rgba(44, 44, 60, 0.85);
      padding: 40px 50px;
      border-radius: 16px;
      box-shadow: 0 0 30px rgba(0,0,0,0.6);
      width: 100%;
      max-width: 600px;
      text-align: center;
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

    .question-image-wrapper {
      display: flex;
      justify-content: center;
      margin-bottom: 15px;
    }

    .question-image {
      max-width: 300px;
      max-height: 200px;
      width: auto;
      height: auto;
      border-radius: 10px;
    }

    .input-wrapper {
      display: flex;
      justify-content: center;
      margin-bottom: 15px;
      flex-direction: column;
      align-items: center;
    }

    input[type="text"] {
      max-width: 300px;
      width: 100%;
      padding: 10px;
      border: none;
      border-radius: 8px;
      background-color: #3c3c4c;
      color: #fff;
      font-size: 16px;
      text-align: center;

      text-transform: none;   /* pas de majuscules forcées */
      letter-spacing: normal; /* pas d'espacement bizarre */

    }

    .input-error {
      color: red;
      font-weight: bold;
      margin-top: 5px;
      text-align: center;
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
  `}</style>
</>

  );
}
