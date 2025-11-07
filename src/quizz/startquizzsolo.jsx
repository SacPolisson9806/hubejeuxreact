import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function StartQuizzSolo() {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedThemes, pointsToWin, timePerQuestion, username } = location.state || {};
  const selectedTheme = selectedThemes?.[0] || "Minecraft";

  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion || 30);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // ✅ Questions mockées localement
  const mockQuestions = [
    {
      question: "Quel est le bloc le plus dur dans Minecraft ?",
      options: ["Pierre", "Bedrock", "Obsidienne", "Fer"],
      answer: "Bedrock"
    },
    {
      question: "Qui est le sorcier principal dans Harry Potter ?",
      options: ["Ron", "Voldemort", "Dumbledore", "Harry"],
      answer: "Dumbledore"
    },
    {
      question: "Quelle planète est la plus proche du Soleil ?",
      options: ["Mars", "Terre", "Mercure", "Vénus"],
      answer: "Mercure"
    }
  ];

  useEffect(() => {
    setQuestions(mockQuestions);
    setCurrentQuestion(mockQuestions[0]);
    setTimeLeft(timePerQuestion);
  }, [timePerQuestion]);

  useEffect(() => {
    if (!currentQuestion || showAnswer) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQuestion, showAnswer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const correct = currentQuestion.answer;
    setCorrectAnswer(correct);
    setShowAnswer(true);
    if (userAnswer === correct) setScore((prev) => prev + 10);

    setTimeout(() => {
      const nextIndex = index + 1;
      if (nextIndex < questions.length) {
        setIndex(nextIndex);
        setCurrentQuestion(questions[nextIndex]);
        setTimeLeft(timePerQuestion);
        setUserAnswer('');
        setShowAnswer(false);
      } else {
        alert(`Fin du quiz ! Score final : ${score} pts`);
        navigate('/quizz');
      }
    }, 3000);
  };

  const handleTimeout = () => {
    setCorrectAnswer(currentQuestion.answer);
    setShowAnswer(true);
    setTimeout(() => {
      const nextIndex = index + 1;
      if (nextIndex < questions.length) {
        setIndex(nextIndex);
        setCurrentQuestion(questions[nextIndex]);
        setTimeLeft(timePerQuestion);
        setUserAnswer('');
        setShowAnswer(false);
      } else {
        alert(`Fin du quiz ! Score final : ${score} pts`);
        navigate('/quizz');
      }
    }, 3000);
  };

  if (!currentQuestion) return <p style={{ textAlign: 'center' }}>Chargement des questions...</p>;

  return (
    <>
      <div className="container">
        <h1>Quiz Solo : {selectedTheme}</h1>
        <p>Temps restant : {timeLeft} secondes</p>
        <p>Score : {score} pts</p>

        {showAnswer ? (
          <p>✅ La bonne réponse était : <strong>{correctAnswer}</strong></p>
        ) : (
          <form onSubmit={handleSubmit}>
            <p>{currentQuestion.question}</p>
            {currentQuestion.options.map((opt, i) => (
              <label key={i}>
                <input type="radio" name="answer" value={opt} required onChange={(e) => setUserAnswer(e.target.value)} /> {opt}
              </label>
            ))}
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
          box-shadow: 0 0 30px rgba(253, 253, 253, 0.96);
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

        input[type="radio"] {
          margin-right: 10px;
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
        }

        button:hover {
          background-color: #0099cc;
        }
      `}</style>
    </>
  );
}
