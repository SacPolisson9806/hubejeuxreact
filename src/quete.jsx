// Quetes.jsx
import React, { useState, useEffect } from "react";

/*
  Quetes.jsx (single-file)
  - Style : Battle-Pass / Fortnite-like (choisi au hasard)
  - Structure : jeux -> catégories -> niveaux empilés (volets)
  - Logique : seul le prochain niveau déblocable est cliquable. Cliquer ouvre le volet.
  - Actions : "Marquer comme terminé" complète et débloque le suivant.
  - Modal : agrandir médaillon (utilise image uploadée comme exemple).
*/

export default function Quetes() {
  // Exemple de données : chaque jeu contient des catégories, chaque catégorie des niveaux
  const data = [
    {
      jeu: "2048",
      categories: [
        {
          key: "ascension",
          titre: "Ascension Légendaire",
          niveaux: [
            { id: "2048-1", niveau: "Petit Bond", objectif: "Atteindre 32", progression: 40, recompense: "5 XP", img: "/mnt/data/d7ba5c0b-fe71-4880-b6fb-c06040c6d021.png" },
            { id: "2048-2", niveau: "Montée en Puissance", objectif: "Atteindre 128", progression: 0, recompense: "10 XP", img: "/mnt/data/d7ba5c0b-fe71-4880-b6fb-c06040c6d021.png" },
            { id: "2048-3", niveau: "Grand Bond", objectif: "Atteindre 512", progression: 0, recompense: "15 XP", img: "/mnt/data/d7ba5c0b-fe71-4880-b6fb-c06040c6d021.png" },
            { id: "2048-4", niveau: "Maître des Tuiles", objectif: "Atteindre 2048", progression: 0, recompense: "20 XP", img: "/mnt/data/d7ba5c0b-fe71-4880-b6fb-c06040c6d021.png" },
            { id: "2048-5", niveau: "Titan", objectif: "Atteindre 8192", progression: 0, recompense: "25 XP", img: "/mnt/data/d7ba5c0b-fe71-4880-b6fb-c06040c6d021.png" },
            { id: "2048-6", niveau: "Légende Épique", objectif: "Atteindre 32768", progression: 0, recompense: "30 XP", img: "/mnt/data/d7ba5c0b-fe71-4880-b6fb-c06040c6d021.png" },
          ]
        }
      ]
    },
    {
      jeu: "Course d'Évitement",
      categories: [
        {
          key: "nitro",
          titre: "Maîtrises du Volant",
          niveaux: [
            { id: "car-1", niveau: "Novice Conducteur", objectif: "Utiliser le nitro 10 fois", progression: 60, recompense: "10 XP", img: "/mnt/data/d7ba5c0b-fe71-4880-b6fb-c06040c6d021.png" },
            { id: "car-2", niveau: "Apprenti", objectif: "Éviter 50 voitures", progression: 0, recompense: "20 XP", img: "/mnt/data/d7ba5c0b-fe71-4880-b6fb-c06040c6d021.png" },
          ]
        }
      ]
    }
  ];

  // State pour suivre l'index ouvert par catégorie (par jeu+cat key)
  // Structure : { "<jeu>::<categorieKey>": openedIndex }
  const [openedMap, setOpenedMap] = useState(() => ({}));
  // State pour suivi complétion par niveau id => boolean
  const [doneMap, setDoneMap] = useState(() => ({}));

  // Modal pour médaillon agrandi
  const [modalImg, setModalImg] = useState(null);

  // When modal open, block scroll robustly
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    if (modalImg) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prevOverflow || "";
    }
    return () => { document.body.style.overflow = prevOverflow || ""; };
  }, [modalImg]);

  // helper: key for category
  const catKey = (jeu, cat) => `${jeu}::${cat}`;

  // open a level (if unlocked)
  const openLevel = (jeu, cat, idx) => {
    const key = catKey(jeu, cat);
    // check unlocked: it's unlocked if all previous levels have been marked done
    const niveauList = (data.find(d => d.jeu === jeu).categories.find(c => c.key === cat)).niveaux;
    let unlocked = true;
    for (let i = 0; i < idx; i++) {
      if (!doneMap[niveauList[i].id]) { unlocked = false; break; }
    }
    if (!unlocked) return; // not clickable
    setOpenedMap(prev => ({ ...prev, [key]: prev[key] === idx ? -1 : idx })); // toggle
  };

  // mark level as done (completes and unlocks next)
  const completeLevel = (levelId) => {
    setDoneMap(prev => ({ ...prev, [levelId]: true }));
  };

  // helper to check if level is unlocked
  const isUnlocked = (jeu, cat, idx) => {
    const niveauList = (data.find(d => d.jeu === jeu).categories.find(c => c.key === cat)).niveaux;
    for (let i = 0; i < idx; i++) {
      if (!doneMap[niveauList[i].id]) return false;
    }
    return true;
  };

  // style chosen: Battle-Pass / Fortnite-like (inline CSS block below)
  return (
    <div className="quetes-root">
      <style>{`
        :root {
          --accent: #7ec8e3;
          --bg: #0f1116;
          --card: linear-gradient(180deg,#11141a,#0f1419);
          --glass: rgba(255,255,255,0.04);
        }
        * { box-sizing: border-box; font-family: 'Inter', Arial, sans-serif; }
        .quetes-root { min-height:100vh; padding:36px; background: var(--bg); color:#eaf7ff; }
        .page-title { text-align:center; font-size:28px; color: #bff0ff; margin-bottom:26px; font-weight:800; }

        .game-section { margin-bottom:36px; }
        .game-header { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; }
        .game-title { font-size:20px; color:var(--accent); font-weight:800; border-bottom:2px solid rgba(126,200,227,0.08); padding-bottom:6px; }

        .categories { display:flex; flex-direction:column; gap:12px; max-width:920px; margin:0 auto; }

        /* Category container */
        .category {
          background: var(--card);
          border-radius:12px;
          padding:12px;
          border:1px solid var(--glass);
          box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        }
        .cat-title {
          font-weight:800; color:#bfefff; display:flex; align-items:center; gap:10px;
        }

        /* Niveau (volet) */
        .niveau {
          margin-top:10px;
          border-radius:10px;
          overflow:visible;
        }

        .niveau-row {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding:12px;
          background: linear-gradient(90deg, rgba(255,255,255,0.02), transparent);
          border-radius:10px;
          cursor:pointer;
          transition: transform .18s ease, box-shadow .18s ease, background .18s;
          border:1px solid rgba(255,255,255,0.03);
        }

        .niveau-row.locked {
          opacity:0.4;
          cursor: default;
        }

        .niveau-row:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.6);
        }

        .left {
          display:flex; align-items:center; gap:12px;
        }
        .badge {
          width:46px; height:46px; border-radius:50%;
          display:flex; align-items:center; justify-content:center; font-weight:900; color:#fff;
          box-shadow: 0 8px 20px rgba(0,0,0,0.6);
          border: 3px solid rgba(255,255,255,0.08);
          flex-shrink:0;
        }
        .info {
          display:flex; flex-direction:column;
        }
        .level-name { font-weight:800; color:#dff8ff; }
        .level-sub { font-size:13px; color:#cfeefb; }

        .right {
          display:flex; align-items:center; gap:12px;
        }

        .progress-pill {
          background: rgba(0,0,0,0.25); padding:6px 10px; border-radius:999px; border:1px solid rgba(255,255,255,0.03);
          font-weight:800; color:#dff8ff; font-size:13px;
        }

        .chevron { font-size:18px; opacity:0.9; }

        /* content revealed */
        .level-panel {
          overflow:hidden;
          transition: max-height 0.36s ease, padding 0.28s ease;
          background: linear-gradient(180deg, rgba(255,255,255,0.018), rgba(0,0,0,0.02));
          margin-top:8px;
          border-radius:8px;
          padding:0 12px;
        }
        .level-panel.closed { max-height:0; padding-top:0; padding-bottom:0; }
        .level-panel.open { max-height:320px; padding:12px; }

        .panel-row { display:flex; gap:12px; align-items:flex-start; }
        .panel-left { flex:1; }
        .panel-right { width:160px; display:flex; flex-direction:column; gap:8px; align-items:center; }

        .panel-objectif { color:#cfeefb; margin-bottom:8px; font-weight:700; }
        .panel-progressbar { height:12px; background: rgba(255,255,255,0.04); border-radius:8px; overflow:hidden; margin-bottom:8px; }
        .panel-progress { height:100%; background: linear-gradient(90deg,var(--accent), #a0d8ff); color:#000; font-weight:800; text-align:center; line-height:12px; font-size:12px; }

        .panel-reward { font-weight:900; color:#9fe8ff; }

        .panel-medaillon {
          width:100px; height:100px; border-radius:50%; overflow:hidden; display:flex; align-items:center; justify-content:center; border:6px solid rgba(255,255,255,0.9); box-shadow: 0 20px 50px rgba(0,0,0,0.6); cursor:pointer;
        }
        .panel-medaillon img { width:92%; height:92%; object-fit:contain; }

        .btn-complete {
          background: linear-gradient(90deg,#4ae0a6,#07d08b);
          color:#012; border:none; padding:10px 14px; border-radius:10px; font-weight:900; cursor:pointer; box-shadow: 0 8px 20px rgba(0,0,0,0.45);
        }

        .locked-tag {
          display:inline-block; padding:6px 10px; background: rgba(255,80,80,0.12); color:#ff8a8a; border-radius:999px; font-weight:800; border:1px solid rgba(255,80,80,0.08);
        }

        /* responsive */
        @media (max-width:900px) {
          .panel-right { width:120px; }
          .panel-medaillon { width:84px; height:84px; border-width:5px; }
        }
      `}</style>

      <div className="page-title">🗡️ Quêtes — Battle Pass</div>

      {data.map((game) => (
        <section key={game.jeu} className="game-section">
          <div className="game-header">
            <div className="game-title">{game.jeu}</div>
            <div style={{ fontSize: 14, color: "#9fdcff", fontWeight: 800 }}>{game.categories.length} catégorie(s)</div>
          </div>

          <div className="categories">
            {game.categories.map((cat) => {
              const key = catKey(game.jeu, cat.key);
              const openedIndex = openedMap[key] ?? -1;

              return (
                <div className="category" key={cat.key}>
                  <div className="cat-title">{cat.titre}</div>

                  {cat.niveaux.map((lvl, idx) => {
                    const unlocked = isUnlocked(game.jeu, cat.key, idx);
                    const completed = !!doneMap[lvl.id];
                    const isOpen = openedIndex === idx;

                    return (
                      <div className="niveau" key={lvl.id}>
                        <div
                          className={`niveau-row ${unlocked ? "" : "locked"}`}
                          onClick={() => unlocked && openLevel(game.jeu, cat.key, idx)}
                        >
                          <div className="left">
                            <div className="badge" style={{ background: completed ? "#20c997" : (unlocked ? "#ff6b6b" : "#555") }}>
                              {idx + 1}
                            </div>
                            <div className="info">
                              <div className="level-name">{lvl.niveau}</div>
                              <div className="level-sub">{lvl.objectif}</div>
                            </div>
                          </div>

                          <div className="right">
                            <div className="progress-pill">{lvl.progression}%</div>
                            <div className="chevron">{isOpen ? "▾" : "▸"}</div>
                          </div>
                        </div>

                        <div className={`level-panel ${isOpen ? "open" : "closed"}`}>
                          <div className="panel-row">
                            <div className="panel-left">
                              <div className="panel-objectif"><strong>Objectif:</strong> {lvl.objectif}</div>
                              <div className="panel-progressbar"><div className="panel-progress" style={{ width: `${lvl.progression}%` }}>{lvl.progression}%</div></div>
                              <div className="panel-reward"><strong>Récompense:</strong> {lvl.recompense}</div>
                            </div>

                            <div className="panel-right">
                              <div className="panel-medaillon" title="Agrandir le médaillon" onClick={() => setModalImg(lvl.img)}>
                                <img src={lvl.img} alt={lvl.niveau} draggable={false} />
                              </div>

                              {!completed ? (
                                <button className="btn-complete" onClick={() => completeLevel(lvl.id)}>Marquer comme terminé</button>
                              ) : (
                                <div style={{ color: "#8fffdc", fontWeight: 900 }}>✔ Terminé</div>
                              )}

                              {!unlocked && <div className="locked-tag">Bloqué</div>}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Modal simple pour agrandir médaillon */}
      {modalImg && (
        <div className="modal-overlay" onClick={() => setModalImg(null)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 4000
        }}>
          <button onClick={() => setModalImg(null)} style={{
            position: "fixed", top: 12, right: 12, zIndex: 4500, background: "#0c00f6", color: "#fff", border: "none", padding: "10px 14px", borderRadius: 8, cursor: "pointer", fontWeight: 800
          }}>↩</button>

          <div style={{ width: 520, height: 520, borderRadius: "50%", overflow: "hidden", border: "12px solid rgba(255,255,255,0.95)", boxShadow: "0 80px 160px rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", background: "#0b0b0c" }} onClick={(e) => e.stopPropagation()}>
            <img src={modalImg} alt="médaillon" style={{ width: "92%", height: "92%", objectFit: "contain", userSelect: "none" }} />
          </div>
        </div>
      )}
    </div>
  );
}
