import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuizzSolo() {
  const navigate = useNavigate();

  const themes = ['minecraft', 'hiragana', 'hiragana(variant dakuten)', 'hiragana(combinaison)', 'Geographie'];
  const [selectedThemes, setSelectedThemes] = useState([]);
  const [pointsToWin, setPointsToWin] = useState(100);
  const [timePerQuestion, setTimePerQuestion] = useState(30);

  useEffect(() => {
    document.body.style.backgroundColor = '#eef3ff';
  }, []);

  const handleThemeChange = (theme) => {
    setSelectedThemes((prev) =>
      prev.includes(theme)
        ? prev.filter((t) => t !== theme)
        : [...prev, theme]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedThemes.length === 0) {
      alert("Choisis au moins un thème !");
      return;
    }

    navigate('/startquizzsolo', {
      state: {
        selectedThemes,
        pointsToWin,
        timePerQuestion,
        mode: 'solo',
      },
    });
  };

  return (
    <>
      <style>{`
        .container {
          max-width: 700px;
          margin: 40px auto;
          background: white;
          padding: 40px 30px;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(34, 17, 223, 0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        h1 {
          font-size: 28px;
          color: #0c00f6;
          margin-bottom: 20px;
          font-weight: bold;
          text-align: center;
        }
        label {
          display: block;
          margin-top: 20px;
          font-weight: bold;
          color: #333;
        }
        .themes {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 10px;
        }
        .theme {
          padding: 10px 20px;
          border-radius: 8px;
          border: 2px solid #0c00f6;
          cursor: pointer;
          font-weight: bold;
          color: #0c00f6;
          background: white;
          transition: 0.3s;
        }
        .theme.selected {
          background: #0c00f6;
          color: white;
        }
        select {
          width: 100%;
          padding: 10px;
          margin-top: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 16px;
        }
        button {
          display: block;
          width: 100%;
          margin-top: 30px;
          padding: 12px;
          background: #0c00f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }
        button:hover {
          background: #0a00d0;
        }
      `}</style>

      <div className="container">
        <h1>🎯 Quiz Solo</h1>

        <form onSubmit={handleSubmit}>
          <label>Choisis un ou plusieurs thèmes :</label>
          <div className="themes">
            {themes.map((theme) => (
              <div
                key={theme}
                className={`theme ${selectedThemes.includes(theme) ? 'selected' : ''}`}
                onClick={() => handleThemeChange(theme)}
              >
                {theme}
              </div>
            ))}
          </div>

          <label>Nombre de points à atteindre :</label>
          <select
            value={pointsToWin}
            onChange={(e) => setPointsToWin(parseInt(e.target.value))}
          >
            {[...Array(10)].map((_, i) => {
              const val = 50 + i * 50;
              return <option key={val} value={val}>{val}</option>;
            })}
          </select>

          <label>Temps par question (secondes) :</label>
          <select
            value={timePerQuestion}
            onChange={(e) => setTimePerQuestion(parseInt(e.target.value))}
          >
            {[...Array(12)].map((_, i) => {
              const val = 5 + i * 5;
              return <option key={val} value={val}>{val} secondes</option>;
            })}
          </select>

          <button type="submit">🚀 Commencer le quiz</button>
        </form>
      </div>
    </>
  );
}
