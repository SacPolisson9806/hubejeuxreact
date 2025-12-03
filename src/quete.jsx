import React, { useState } from "react";

export default function Quetes() {
  const [openCategory, setOpenCategory] = useState(null);
  const [openQuest, setOpenQuest] = useState(null);

  const data = [ 
    { 
      jeu: "2048", 
      categories: [ 
        { 
          key: "ascension", 
          titre: "Ascension Légendaire", 
          niveaux: [
            { id: "2048-1", niveau: "Petit Bond", objectif: "Atteindre 32", progression: 40, recompense: "5 XP"},
            { id: "2048-2", niveau: "Montée en Puissance", objectif: "Atteindre 128", progression: 0, recompense: "10 XP"},
            { id: "2048-3", niveau: "Grand Bond", objectif: "Atteindre 512", progression: 0, recompense: "15 XP"},
            { id: "2048-4", niveau: "Maître des Tuiles", objectif: "Atteindre 2048", progression: 0, recompense: "20 XP"},
            { id: "2048-5", niveau: "Titan", objectif: "Atteindre 8192", progression: 0, recompense: "25 XP"},
            { id: "2048-6", niveau: "Légende Épique", objectif: "Atteindre 32768", progression: 0, recompense: "30 XP"},
          ] 
        },
        {
          key: "Combos",
          titre: "Épopée des Combos",
          niveaux: [
            { id: "2048-1", niveau: "Premier Enchaînement", objectif: "Fait 10 parfait combos", progression: 40, recompense: "5 XP"},
            { id: "2048-2", niveau: "Chaîne Montante", objectif: "Fait 40 parfait combos", progression: 0, recompense: "10 XP"},
            { id: "2048-3", niveau: "Fusion Harmonique", objectif: "Fait 80 parfait combos", progression: 0, recompense: "15 XP"},
            { id: "2048-4", niveau: "Combo Magistral", objectif: "Fait 110 parfait combos", progression: 0, recompense: "20 XP"},
            { id: "2048-5", niveau: "Enchaînement Légendaire", objectif: "Fait 140 parfait combos", progression: 0, recompense: "25 XP"},
            { id: "2048-6", niveau: "Maître des Combos", objectif: "Fait 200 parfait combos", progression: 0, recompense: "30 XP"},
          ]
        },
      ] 
    },
    { 
      jeu: "Course d'Évitement", 
      categories: [
        { 
          key: "nitro", 
          titre: "Maîtrise du Nitro", 
          niveaux: [
            { id: "course-1", niveau: "Départ Fulgurant", objectif: "Première utilisation du nitro avec succès", progression: 40, recompense: "5 XP"},
            { id: "course-2", niveau: "Accélération Contrôlée", objectif: "Utiliser le nitro 10 fois", progression: 0, recompense: "10 XP"},
            { id: "course-3", niveau: "Sprinteur Agile", objectif: "Atteindre 50 km/h grâce au nitro", progression: 0, recompense: "15 XP"},
            { id: "course-4", niveau: "Turbo en Action", objectif: "Enchaîner 3 utilisations du nitro sans collision", progression: 0, recompense: "20 XP"},
            { id: "course-5", niveau: "Nitro Légendaire", objectif: "Faire un combo de 5 nitros consécutifs", progression: 0, recompense: "25 XP"},
            { id: "course-6", niveau: "Maître du Turbo", objectif: "Utiliser le nitro 20 fois dans une seule course", progression: 0, recompense: "30 XP"},
          ]
        },
        { 
          key: "evitement", 
          titre: "Maîtrise de l’Évitement", 
          niveaux: [
            { id: "course-1", niveau: "Esquive Débutante", objectif: "Éviter 10 voitures", progression: 40, recompense: "5 XP"},
            { id: "course-2", niveau: "Pilote Agile", objectif: "Éviter 25 voitures", progression: 0, recompense: "10 XP"},
            { id: "course-3", niveau: "Maître du Volant", objectif: "Éviter 50 voitures", progression: 0, recompense: "15 XP"},
            { id: "course-4", niveau: "Danse avec les Obstacles", objectif: "Éviter 75 voitures", progression: 0, recompense: "20 XP"},
            { id: "course-5", niveau: "Évitement Légendaire", objectif: "Éviter 100 voitures", progression: 0, recompense: "25 XP"},
            { id: "course-6", niveau: "Champion du Circuit", objectif: "Éviter 150 voitures sans collision", progression: 0, recompense: "30 XP"},
          ]
        },
        { 
          key: "distance", 
          titre: "Maîtrise de la Distance", 
          niveaux: [
            { id: "course-1", niveau: "Premiers Kilomètres", objectif: "Parcourir 1km", progression: 40, recompense: "5 XP"},
            { id: "course-2", niveau: "Distance Émergente", objectif: "Parcourir 100 km", progression: 0, recompense: "10 XP"},
            { id: "course-3", niveau: "Pilote Endurant", objectif: "Parcourir 500 km", progression: 0, recompense: "15 XP"},
            { id: "course-4", niveau: "Marathon du Volant", objectif: "Parcourir 5000 km", progression: 0, recompense: "20 XP"},
            { id: "course-5", niveau: "Champion de la Route", objectif: "Parcourir 20000 km", progression: 0, recompense: "25 XP"},
            { id: "course-6", niveau: "Légende de la Distance", objectif: "Parcourir  100000 km", progression: 0, recompense: "30 XP"},
          ]
        },
      ] 
    },
    { 
      jeu: "Chiffre mystere", 
      categories: [
        { 
          key: "mots", 
          titre: "Maîtrise des Mots", 
          niveaux: [
            { id: "chiffre-1", niveau: "Novice des Lettres", objectif: "Trouver 10 mots", progression: 40, recompense: "5 XP"},
            { id: "chiffre-2", niveau: "Explorateur des Mots", objectif: "Trouver 50 mots", progression: 0, recompense: "10 XP"},
            { id: "chiffre-3", niveau: "Chasseur de Mots", objectif: "Trouver 150 mots", progression: 0, recompense: "15 XP"},
            { id: "chiffre-4", niveau: "Maître du Vocabulaire", objectif: "Trouver 500 mots", progression: 0, recompense: "20 XP"},
            { id: "chiffre-5", niveau: "Légende des Lettres", objectif: "Trouver 50000 mots", progression: 0, recompense: "25 XP"},
            { id: "chiffre-6", niveau: "Génie des Mots", objectif: "Trouver 10000 mots", progression: 0, recompense: "30 XP"},
          ]
        },
        { 
          key: "precision", 
          titre: "Précision Maximale", 
          niveaux: [
            { id: "chiffre-1", niveau: "Débutant Prudent", objectif: "Trouver 5 mots avec maximum 2 fautes", progression: 40, recompense: "5 XP"},
            { id: "chiffre-2", niveau: "Vigilant", objectif: "Trouver 10 mots avec maximum 3 fautes", progression: 0, recompense: "10 XP"},
            { id: "chiffre-3", niveau: "Chasseur Exact", objectif: "Trouver 20 mots avec maximum 4 fautes", progression: 0, recompense: "15 XP"},
            { id: "chiffre-4", niveau: "Maître de la Précision", objectif: "Trouver 35 mots avec maximum 5 fautes", progression: 0, recompense: "20 XP"},
            { id: "chiffre-5", niveau: "Légende Précise", objectif: "Trouver 50 mots avec maximum 6 fautes", progression: 0, recompense: "25 XP"},
            { id: "chiffre-6", niveau: "Génie Impeccable", objectif: "Trouver 75 mots avec maximum 7 fautes", progression: 0, recompense: "30 XP"},
          ]
        },
      ] 
    } 
  ];

  return (
    <div className="page-quetes">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

        body, html, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          font-family: 'Orbitron', sans-serif;
        }

        .page-quetes {
          min-height: 100vh;
          width: 100%;
          padding: 40px 20px;
          background: linear-gradient(160deg, #1b1b2a, #2f2f3f);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
        }

        .jeu-section {
          width: 100%;
          max-width: 1400px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .jeu-title {
          font-size: 48px;
          color: #ffd700;
          text-shadow: 2px 2px 6px #000;
          margin-bottom: 10px;
        }

        .categorie-card {
          background: #2f2f40;
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.7);
          transition: transform 0.2s;
        }

        .categorie-card:hover {
          transform: translateY(-5px);
        }

        .categorie-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 24px;
          font-weight: 700;
          padding: 15px 20px;
          cursor: pointer;
          background: #3b3b55;
          border-radius: 16px;
          transition: background 0.2s;
        }

        .categorie-header:hover {
          background: #4b4b6b;
        }

        .niveaux-list {
          margin-top: 15px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .niveau-card {
          background: #3c3c5a;
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .niveau-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.6);
        }

        .niveau-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 15px 20px;
          cursor: pointer;
          font-size: 20px;
        }

        .niveau-header .left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .med-small {
          width: 60px;
          height: 60px;
          border-radius: 10px;
        }

        .niveau-content {
          padding: 20px;
          background: #2b2b40;
          border-top: 1px solid #505060;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .progress-bar {
          width: 100%;
          height: 18px;
          background: #505060;
          border-radius: 10px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #00d4ff;
          border-radius: 10px;
          transition: width 0.4s;
        }

        .big-med {
          width: 180px;
          border-radius: 12px;
        }

        .arrow {
          font-size: 24px;
          color: #fff;
        }
      `}</style>

      {data.map((jeu, idx) => (
        <div key={idx} className="jeu-section">
          <div className="jeu-title">{jeu.jeu}</div>

          {jeu.categories.map(cat => (
            <div key={cat.key} className="categorie-card">
              <div 
                className="categorie-header"
                onClick={() => setOpenCategory(openCategory === cat.key ? null : cat.key)}
              >
                {cat.titre} <span className="arrow">{openCategory === cat.key ? '▲' : '▼'}</span>
              </div>

              {openCategory === cat.key && (
                <div className="niveaux-list">
                  {cat.niveaux.map(n => (
                    <div key={n.id} className="niveau-card">
                      <div 
                        className="niveau-header"
                        onClick={() => setOpenQuest(openQuest === n.id ? null : n.id)}
                      >
                        <div className="left">
                          <img src={n.img} className="med-small" alt="" />
                          <span>{n.niveau}</span>
                        </div>
                        <span className="arrow">{openQuest === n.id ? '▲' : '▼'}</span>
                      </div>

                      {openQuest === n.id && (
                        <div className="niveau-content">
                          <p><strong>Objectif:</strong> {n.objectif}</p>
                          <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${n.progression}%` }}></div>
                          </div>
                          <p><strong>Récompense:</strong> {n.recompense}</p>
                          <img src={n.img} className="big-med" alt="medaillon" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
