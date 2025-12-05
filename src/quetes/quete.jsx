import React, { useState, useEffect } from "react";
import { questsData } from "./quetesdata";
import QuestManager from "./quetesmanager";
import { useNavigate } from "react-router-dom";

export default function Quetes({ playerName }) {
  const [openCategory, setOpenCategory] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    QuestManager.initQuestsForPlayer(playerName);
  }, [playerName]);

  return (
    <div className="page-quetes">
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          font-family: 'Poppins', sans-serif;
          overflow: hidden;
        }

        body::before {
          content:"";
          position:fixed;
          top:0;
          left:0;
          width:100%;
          height:100%;
          background: radial-gradient(circle at top, #0a0a2a, #030314, #0a0a2a);
          background-size:400% 400%;
          animation: gradientMove 15s ease infinite;
          z-index:-1;
        }

        @keyframes gradientMove {
          0%{background-position:0% 50%;}
          50%{background-position:100% 50%;}
          100%{background-position:0% 50%;}
        }

        .page-quetes {
          height: 100vh;
          width: 100%;
          padding: 20px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          overflow-y: scroll;
          scrollbar-width: none;
        }

        .page-quetes::-webkit-scrollbar {
          display: none;
        }

        .jeu-section {
          width: 100%;
          max-width: 1200px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .jeu-title {
          font-size: 36px;
          font-weight: 700;
          background: linear-gradient(90deg, #00d4ff, #00ffaa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .categorie-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .categorie-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 35px rgba(0,180,255,0.2);
        }

        .categorie-header {
          font-size: 22px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          background: rgba(255,255,255,0.05);
          border-radius: 14px;
          transition: background 0.2s;
        }

        .categorie-header:hover {
          background: rgba(255,255,255,0.1);
        }

        .niveau-bar {
          margin-top: 12px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .niveau-item {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 8px 12px;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
        }

        .niveau-name {
          font-size: 16px;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
        }

        .niveau-objectif {
          font-size: 14px;
          color: #ccc;
        }

        .progress-bar {
          width: 100%;
          height: 18px;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #00d4ff, #00ffaa);
          border-radius: 10px;
          transition: width 0.4s;
        }

        .recompense {
          font-size: 14px;
          color: #00ffaa;
          font-weight: 500;
        }

        .completed .niveau-name,
        .completed .niveau-objectif {
          text-decoration: line-through;
          color: #a0cfff;
        }

        .btn-retour {
          margin-top: 20px;
          padding: 12px 0;
          width: 220px;
          border: none;
          border-radius: 14px;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
          background: linear-gradient(90deg, #00d4ff, #00ffaa);
          color: #000;
          transition: all 0.3s ease;
          align-self: center;
        }

        .btn-retour:hover {
          transform: scale(1.05);
        }
      `}</style>

      {questsData.map((jeu, idx) => (
        <div key={idx} className="jeu-section">
          <div className="jeu-title">{jeu.jeu}</div>

          {jeu.categories.map(cat => {
            const playerProgress = QuestManager.getPlayerProgress(playerName, cat.key);

            return (
              <div key={cat.key} className="categorie-card">
                <div
                  className="categorie-header"
                  onClick={() =>
                    setOpenCategory(openCategory === cat.key ? null : cat.key)
                  }
                >
                  {cat.titre} <span>{openCategory === cat.key ? "▲" : "▼"}</span>
                </div>

                {openCategory === cat.key && (
                  <div className="niveau-bar">
                    {cat.niveaux.map(n => {
                      const q = playerProgress.find(p => p.id === n.id);

                      // 🔥 Correction essentielle ici :
                      const progressPercent = Math.min(
                        ((q?.progression || 0) / (q?.objectifValue || 1)) * 100,
                        100
                      );

                      return (
                        <div key={n.id} className={`niveau-item ${q?.completed ? "completed" : ""}`}>
                          <div className="niveau-name">
                            {n.niveau} {q?.completed ? "✔️" : ""}
                          </div>
                          <div className="niveau-objectif">
                            Objectif : {n.objectif}
                          </div>
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <div className="recompense">
                            Récompense : {n.recompense}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}

      {/* Bouton retour */}
      <button className="btn-retour" onClick={() => navigate("/hubjeux")}>
        ↩ Retour au Hub
      </button>
    </div>
  );
}
