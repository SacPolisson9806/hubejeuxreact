// QueteMedailon.jsx
import React, { useEffect } from "react";

export default function QueteMedailon({ medaillon, onClose }) {
  // Bloquer scroll quand le modal est ouvert
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <button className="close-btn" onClick={onClose}>↩</button>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={medaillon.img} alt={medaillon.titre} />
      </div>

      <style>{`
        .modal-overlay {
          position:fixed; inset:0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(5px);
          display:flex; align-items:center; justify-content:center;
          z-index:1000;
        }
        .modal-content { width:400px; height:400px; }
        .modal-content img { width:100%; height:100%; object-fit:contain; border-radius:12px; }
        .close-btn {
          position:fixed; top:20px; right:20px; z-index:1100;
          background:#0c00f6; color:#fff; border:none; padding:10px 16px; border-radius:8px;
          cursor:pointer; font-size:18px;
        }
      `}</style>
    </div>
  );
}
