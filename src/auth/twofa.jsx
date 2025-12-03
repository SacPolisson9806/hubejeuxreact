// twofa.jsx
/**
 * Page de vérification 2FA (Google Authenticator / Email code)
 * 
 * Utilise AuthContext pour mettre à jour le token après validation.
 * Compatible React + React Router.
 * Inclut CSS directement dans le composant.
 */

import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "./authcontext.jsx";

export default function TwoFA() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false);

  const username = location.state?.username;
  const server = import.meta.env.VITE_API_URL;

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      showMessage("Entre le code 2FA !", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${server}/2fa-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, code }),
      });

      const data = await response.json();
      if (data.success) {
        showMessage("2FA validé !", "success");

        // 🔹 Stockage du token et pseudo
        login(username, data.token);
        localStorage.setItem("playerName", username);
        localStorage.setItem("token", data.token);

        setTimeout(() => navigate("/hubjeux"), 1000);
      } else {
        showMessage(data.message, "error");
      }
    } catch (err) {
      console.error(err);
      showMessage("Erreur serveur, réessaie plus tard.", "error");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        html, body { margin: 0; padding: 0; height: 100%; width: 100%; font-family: 'Poppins', sans-serif; background: #030314; color:white; display:flex; justify-content:center; align-items:center; }
        .twofa-box { background: rgba(255,255,255,0.05); backdrop-filter: blur(15px); border:1px solid rgba(255,255,255,0.1); border-radius:20px; padding:40px 60px; box-shadow:0 0 25px rgba(0,0,0,0.5); text-align:center; width:340px; }
        .twofa-title { font-size:28px; margin-bottom:25px; background: linear-gradient(90deg, #00d4ff, #00ffaa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .twofa-input { width:100%; padding:12px; border:none; border-radius:10px; background-color:rgba(255,255,255,0.1); color:white; font-size:16px; outline:none; text-align:center; margin-bottom:20px; }
        .twofa-input:focus { background-color: rgba(255,255,255,0.2); box-shadow:0 0 10px #00d4ff; }
        .twofa-button { width:100%; padding:12px; border:none; border-radius:10px; background: linear-gradient(90deg, #00d4ff, #00ffaa); color:#000; font-size:17px; font-weight:bold; cursor:pointer; transition: all 0.3s ease; }
        .twofa-button:hover { background: linear-gradient(90deg, #00ffaa, #00d4ff); transform: scale(1.05); }
        .notification { position: absolute; top:20px; left:50%; transform:translateX(-50%); padding:15px 25px; border-radius:10px; font-weight:bold; color:white; z-index:999; box-shadow: 0 0 15px rgba(0,0,0,0.3); animation: fadein 0.3s, fadeout 0.3s 3.7s; }
        .notification.success { background: #00bfff; }
        .notification.error { background: #ff4c4c; }
        @keyframes fadein { from {opacity:0;} to {opacity:1;} }
        @keyframes fadeout { from {opacity:1;} to {opacity:0;} }
      `}</style>

      <div className="twofa-box">
        {message && <div className={`notification ${messageType}`}>{message}</div>}
        <h1 className="twofa-title">Vérification 2FA</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Code 2FA"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="twofa-input"
          />
          <button type="submit" className="twofa-button" disabled={loading}>
            {loading ? "Vérification..." : "Valider"}
          </button>
        </form>
      </div>
    </>
  );
}
