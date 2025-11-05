import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function StartQuizz() {
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

  // Appliquer le fond panoramique dynamiquement
  useEffect(() => {
    document.body.style.backgroundImage = `url("${backgroundImage}")`;
    document.body.style.backgroundRepeat = 'repeat-x';
    document.body.style.backgroundSize = 'auto 100%';
    document.body.style.animation = 'scrollBackground 60s linear infinite';
    document.body.style.fontFamily = 'Arial, sans-serif';
    document.body.style.color = '#333';
    document.body.style.textAlign = 'center';
  }, [backgroundImage]);

  // Charger les questions
  useEffect(() => {
    const path = `/${selectedTheme.toLowerCase()}.json`;

    fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error(`Fichier JSON introuvable : ${path}`);
        return res.json();
      })
      .then((data) => {
        const shuffled = data.sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert(`Impossible de charger les questions pour ${selectedTheme}.`);
        navigate('/quizz');
      });
  }, [selectedTheme, navigate]);

  const currentQuestion = questions[index];

  const normalize = (text) =>
    text
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]|_/g, '')
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(word => word.length === 1 ? word : word.replace(/\s+/g, ''))
      .join('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const answer = formData.get('answer');

    const correctAnswers = Array.isArray(currentQuestion.answer)
      ? currentQuestion.answer
      : [currentQuestion.answer];

    const isCorrect = correctAnswers.some(
      (a) => normalize(a) === normalize(answer)
    );

    if (isCorrect) {
      const pointsGained = Math.max(1, Math.round(10 * (timeLeft / timePerQuestion)));
      setScore((prev) => prev + pointsGained);
    }

    setShowAnswer(true);
    setTimeout(() => {
      setShowAnswer(false);
      setIndex((prev) => prev + 1);
      setTimeLeft(timePerQuestion);
    }, 2000);
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

  if (loading) return <p style={{ textAlign: 'center' }}>Chargement des questions...</p>;
  if (!currentQuestion) return <p style={{ textAlign: 'center' }}>Aucune question trouvée.</p>;

  return (
    <>
      <style>{`
        @keyframes scrollBackground {
          from { background-position: 0 0; }
          to { background-position: -3000px 0; }
        }

        .container {
          max-width: 700px;
          margin: 50px auto;
          background: rgba(255, 255, 255, 0.9);
          padding: 30px 20px;
          border-radius: 12px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        h1 {
          color: #0c00f6;
          margin-bottom: 15px;
        }

        h2 {
          color: #0c00f6;
          margin: 20px 0 10px 0;
        }

        input[type="text"], input[type="radio"] {
          font-size: 16px;
          margin: 5px 0;
        }

        button {
          padding: 10px 20px;
          margin-top: 10px;
          background: #0c00f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        button:hover {
          background: #0a00d0;
        }

        img {
          max-width: 300px;
          margin: 10px 0;
        }
      `}</style>

      <div className="container">
        <h1>Quiz : {selectedTheme}</h1>
        <p>Score : {score} / {pointsToWin}</p>
        <p>Temps restant : {timeLeft} secondes</p>

        {showAnswer ? (
          <>
            <h2>Réponse :</h2>
            <p>
              La bonne réponse était :{' '}
              <strong>
                {Array.isArray(currentQuestion.answer)
                  ? currentQuestion.answer.join(' / ')
                  : currentQuestion.answer}
              </strong>
            </p>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ fontWeight: 'bold' }}>{currentQuestion.question}</p>
            {currentQuestion.image && (
              <img src={currentQuestion.image} alt="question" />
            )}
            {Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0 ? (
              currentQuestion.options.map((opt, i) => (
                <div key={i} style={{ textAlign: 'left', margin: '5px 0' }}>
                  <input type="radio" name="answer" value={opt} required /> {opt}
                </div>
              ))
            ) : (
              <input
                type="text"
                name="answer"
                placeholder="Votre réponse..."
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  marginTop: '10px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '16px'
                }}
              />
            )}
            <button type="submit">Valider</button>
          </form>
        )}
      </div>
    </>
  );
}
