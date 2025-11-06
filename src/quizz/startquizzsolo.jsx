import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function StartQuizzSolo() {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedThemes, pointsToWin, timePerQuestion } = location.state || {};
  const selectedTheme = selectedThemes?.[0] || "Minecraft";
  const backgroundImage = `/background/${selectedTheme.toLowerCase()}-panorama.jpg`;

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion || 30);
  const [loading, setLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    document.body.style.backgroundImage = `url("${backgroundImage}")`;
    document.body.style.backgroundRepeat = 'repeat-x';
    document.body.style.backgroundSize = 'auto 100%';
    document.body.style.animation = 'scrollBackground 60s linear infinite';
  }, [backgroundImage]);

  useEffect(() => {
    const path = `/${selectedTheme.toLowerCase()}.json`;

    fetch(path)
      .then((res) => res.json())
      .then((data) => {
        const shuffled = data.sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        setLoading(false);
      })
      .catch(() => {
        alert(`Impossible de charger les questions pour ${selectedTheme}.`);
        navigate('/quizz');
      });
  }, [selectedTheme, navigate]);

  const currentQuestion = questions[index];

  const normalize = (text) =>
    text.trim().toLowerCase().normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]|_/g, '')
      .replace(/\s+/g, ' ');

  const handleSubmit = (e) => {
    e.preventDefault();
    const rawAnswer = new FormData(e.target).get('answer');
    const correctAnswers = Array.isArray(currentQuestion.answer)
      ? currentQuestion.answer
      : [currentQuestion.answer];
    const isCorrect = correctAnswers.some((a) => normalize(a) === normalize(rawAnswer));

    if (currentQuestion.type === 'input') {
      if (isCorrect) {
        const pointsGained = Math.max(1, Math.round(10 * (timeLeft / timePerQuestion)));
        setScore((prev) => prev + pointsGained);
        setFeedback('');
        setShowAnswer(true);
        setTimeout(() => {
          setShowAnswer(false);
          setIndex((prev) => prev + 1);
          setTimeLeft(timePerQuestion);
          setUserAnswer('');
        }, 2000);
      } else {
        setFeedback('❌ Réponse fausse, essaie encore !');
        setUserAnswer('');
      }
    } else {
      if (isCorrect) {
        const pointsGained = Math.max(1, Math.round(10 * (timeLeft / timePerQuestion)));
        setScore((prev) => prev + pointsGained);
      }
      setFeedback('');
      setShowAnswer(true);
      setTimeout(() => {
        setShowAnswer(false);
        setIndex((prev) => prev + 1);
        setTimeLeft(timePerQuestion);
        setUserAnswer('');
      }, 2000);
    }
  };

  useEffect(() => {
    if (!currentQuestion || showAnswer) return;
    setTimeLeft(timePerQuestion);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowAnswer(true);
          setTimeout(() => {
            setShowAnswer(false);
            setIndex((prev) => prev + 1);
            setTimeLeft(timePerQuestion);
            setUserAnswer('');
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [index, showAnswer, currentQuestion, timePerQuestion]);

  useEffect(() => {
    if (score >= pointsToWin) {
      alert(`🎉 Vous avez gagné avec ${score} points !`);
      navigate('/quizz');
    } else if (index >= questions.length && questions.length > 0) {
      alert(`Fin du quiz ! Vous avez ${score} points.`);
      navigate('/quizz');
    }
  }, [score, index, questions.length, pointsToWin, navigate]);

  if (loading) return <p>Chargement des questions...</p>;
  if (!currentQuestion) return <p>Aucune question trouvée.</p>;

  return (
    <div className="container">
      <h1>Quiz : {selectedTheme}</h1>
      <p>Score : {score} / {pointsToWin}</p>
      <p>Temps restant : {timeLeft} secondes</p>

      {showAnswer ? (
        <p>✅ La bonne réponse était : <strong>{Array.isArray(currentQuestion.answer) ? currentQuestion.answer.join(' / ') : currentQuestion.answer}</strong></p>
      ) : (
        <form onSubmit={handleSubmit}>
          {currentQuestion.image && <img src={`/${currentQuestion.image}`} alt="question" />}
          <p>{currentQuestion.question}</p>
          {Array.isArray(currentQuestion.options) ? (
            currentQuestion.options.map((opt, i) => (
              <label key={i}>
                <input type="radio" name="answer" value={opt} required /> {opt}
              </label>
            ))
          ) : (
            <>
              <input
                type="text"
                name="answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                required
              />
              {feedback && <div className="feedback">{feedback}</div>}
            </>
          )}
          <button type="submit">Valider</button>
        </form>
      )}
    </div>
  );
}
