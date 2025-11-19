import React, { useState, useRef, useEffect } from "react";

export default function Quetes() {
  const [selectedMedaillon, setSelectedMedaillon] = useState(null);
  const [rotationY, setRotationY] = useState(0);
  const medaillonRef = useRef(null);
  const isDragging = useRef(false);
  const lastX = useRef(0);

  const quetes = [
    {
      jeu: "Course d'Évitement",
      titre: "Maîtrise Nitro",
      medaillonColor: "#FF5733",
      progression: 60,
      niveau: "Novice Conducteur",
      objectif: "Utiliser le nitro 10 fois",
      recompense: "10 XP"
    },
    {
      jeu: "Chiffre Mystère",
      titre: "Chercheur de Mot",
      medaillonColor: "#33FF57",
      progression: 90,
      niveau: "Détective Junior",
      objectif: "Trouver 100 mots",
      recompense: "Médaille spéciale"
    },
    {
      jeu: "2048",
      titre: "Ascension Légendaire",
      medaillonColor: "#3357FF",
      progression: 40,
      niveau: "Petit Bond",
      objectif: "Atteindre 32",
      recompense: "5 XP"
    },
    {
      jeu: "2048",
      titre: "Ascension Légendaire",
      medaillonColor: "#3357FF",
      progression: 40,
      niveau: "Montée en Puissance",
      objectif: "Atteindre 128",
      recompense: "10 XP"
    },
    {
      jeu: "2048",
      titre: "Ascension Légendaire",
      medaillonColor: "#3357FF",
      progression: 40,
      niveau: "Grand Bond",
      objectif: "Atteindre 512",
      recompense: "15 XP"
    },
    {
      jeu: "2048",
      titre: "Ascension Légendaire",
      medaillonColor: "#3357FF",
      progression: 40,
      niveau: "Maître des Tuiles",
      objectif: "Atteindre 2048",
      recompense: "20 XP"
    },
    {
      jeu: "2048",
      titre: "Ascension Légendaire",
      medaillonColor: "#3357FF",
      progression: 40,
      niveau: "Titan",
      objectif: "Atteindre 8192",
      recompense: "25 XP"
    },
    {
      jeu: "2048",
      titre: "Ascension Légendaire",
      medaillonColor: "#3357FF",
      progression: 40,
      niveau: "Légende Épique",
      objectif: "Atteindre 32768",
      recompense: "30 XP"
    }

  ];

  // Groupement par jeu
  const groupedQuetes = quetes.reduce((acc, q) => {
    if (!acc[q.jeu]) acc[q.jeu] = [];
    acc[q.jeu].push(q);
    return acc;
  }, {});

  // --- BLOQUER LE SCROLL DE MANIERE ROBUSTE ---
  // On sauvegarde l'état précédent pour restaurer
  const prevBodyOverflow = useRef("");
  const prevBodyPaddingRight = useRef("");

  // fonctions d'interception d'événements
  const preventDefault = (e) => {
    e.preventDefault();
  };
  const preventKey = (e) => {
    // bloquer les touches de défilement: espace, flèches, pageUp/pageDown, home/end
    const keys = ["ArrowUp","ArrowDown","PageUp","PageDown","Home","End"," "];
    if (keys.includes(e.key)) e.preventDefault();
  };

  const openMedaillon = (q) => {
    setSelectedMedaillon(q);
    setRotationY(0);

    // sauvegarder overflow + padding-right
    prevBodyOverflow.current = document.body.style.overflow;
    prevBodyPaddingRight.current = document.body.style.paddingRight || "";

    // calculer largeur scrollbar et compenser pour éviter "shift"
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    // bloquer le scroll natif
    document.body.style.overflow = "hidden";

    // bloquer wheel & touchmove & keydown
    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });
    window.addEventListener("keydown", preventKey, { passive: false });
  };

  const closeMedaillon = () => {
    setSelectedMedaillon(null);

    // restaurer overflow + padding-right
    document.body.style.overflow = prevBodyOverflow.current || "";
    document.body.style.paddingRight = prevBodyPaddingRight.current || "";

    // enlever listeners
    window.removeEventListener("wheel", preventDefault, { passive: false });
    window.removeEventListener("touchmove", preventDefault, { passive: false });
    window.removeEventListener("keydown", preventKey, { passive: false });
  };

  // nettoyage si le composant est démonté pendant modal ouvert
  useEffect(() => {
    return () => {
      // restore
      document.body.style.overflow = prevBodyOverflow.current || "";
      document.body.style.paddingRight = prevBodyPaddingRight.current || "";
      window.removeEventListener("wheel", preventDefault, { passive: false });
      window.removeEventListener("touchmove", preventDefault, { passive: false });
      window.removeEventListener("keydown", preventKey, { passive: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- DRAG pour rotation (simple) ---
  const handleMouseDown = (e) => {
    isDragging.current = true;
    lastX.current = e.clientX;
    // empêcher sélection texte lors du drag
    e.preventDefault();
  };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastX.current;
    setRotationY((prev) => prev + deltaX * 0.8); // facteur de sensibilité
    lastX.current = e.clientX;
  };

  // --- rendu ---
  return (
    <div className="quetes-page" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; font-family:'Arial',sans-serif; }
        .quetes-page { min-height:100vh; background:#1e1e2f; color:#fff; padding:40px 20px; }
        h1 { text-align:center; color:#7ec8e3; margin-bottom:30px; }
        .jeu-section { margin-bottom:40px; }
        .jeu-titre { font-size:22px; margin-bottom:15px; border-bottom:2px solid #7ec8e3; padding-bottom:5px; color:#7ec8e3; }
        .quetes-container { display:flex; flex-wrap:wrap; gap:20px; justify-content:center; }
        .quete-card { width:220px; padding:20px; background:#2b2b3f; border-radius:12px; text-align:center; cursor:default; display:flex; flex-direction:column; }
        .titre { font-weight:bold; margin-bottom:6px; font-size:18px; color:#7ec8e3; }
        .niveau { font-size:14px; margin-bottom:5px; color:#a0cfff; font-weight:bold; }
        .objectif { font-size:14px; color:#cfdfff; margin-bottom:8px; }
        .recompense { font-size:14px; color:#7ec8e3; margin-bottom:10px; font-weight:bold; }
        .progress-bar { height:14px; width:100%; background:#333; border-radius:7px; overflow:hidden; margin-bottom:10px; }
        .progress { height:100%; background: linear-gradient(90deg, #7ec8e3, #a0d8ff); text-align:center; color:#000; font-size:12px; line-height:14px; }
        .medaillon { width:60px; height:60px; border-radius:50%; margin:10px auto 0 auto; display:flex; align-items:center; justify-content:center; color:#fff; font-size:24px; font-weight:bold; box-shadow:0 4px 8px rgba(0,0,0,0.4),0 0 15px rgba(255,255,255,0.3); border:3px solid #fff; cursor:pointer; transition: transform 0.2s; }
        .medaillon:hover { transform: scale(1.05) rotateY(10deg); }
        /* Modal simplifiée (overlay flou couvrant tout) */
        .modal-overlay { position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.75); backdrop-filter: blur(6px); display:flex; justify-content:center; align-items:center; z-index:1000; }
        .modal-content { display:flex; align-items:center; justify-content:center; position:relative; width:100%; height:100%; }
        .modal-medaillon { width:460px; height:460px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:120px; font-weight:bold; border:8px solid rgba(255,255,255,0.9); cursor:grab; user-select:none; transition: transform 0.08s ease-out; box-shadow: 0 30px 60px rgba(0,0,0,0.6); }
        /* Bouton retour fixé tout en haut à droite (bordé et visible) */
        .close-fixed {
          position: fixed;
          top: 12px;
          right: 12px;
          z-index: 2000;
          background: rgba(255,255,255,0.95);
          color: #111;
          border: none;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight:700;
          box-shadow: 0 6px 20px rgba(0,0,0,0.4);
        }
      `}</style>

      <h1>🗡️ Quêtes</h1>

      {Object.keys(groupedQuetes).map((jeu, idx) => (
        <div className="jeu-section" key={idx}>
          <div className="jeu-titre">{jeu}</div>
          <div className="quetes-container">
            {groupedQuetes[jeu].map((q, i) => (
              <div className="quete-card" key={i}>
                <div className="titre">{q.titre}</div>
                <div className="niveau">{q.niveau}</div>
                <div className="progress-bar">
                  <div className="progress" style={{ width: q.progression + "%" }}>{q.progression}%</div>
                </div>
                <div className="objectif"><strong>Objectif:</strong> {q.objectif}</div>
                <div className="recompense"><strong>Récompense:</strong> {q.recompense}</div>
                <div
                  className="medaillon"
                  style={{ background: q.medaillonColor }}
                  onClick={() => openMedaillon(q)}
                >
                  {q.titre[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {selectedMedaillon && (
        <div className="modal-overlay" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          {/* Bouton retour fixé tout en haut à droite */}
          <button className="close-fixed" onClick={closeMedaillon}>↩ Retour</button>

          <div className="modal-content" aria-hidden={false}>
            <div
              ref={medaillonRef}
              className="modal-medaillon"
              style={{ background: selectedMedaillon.medaillonColor, transform: `rotateY(${rotationY}deg)` }}
              onMouseDown={handleMouseDown}
            >
              {selectedMedaillon.titre[0]}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
