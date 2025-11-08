import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // 'login' ou 'signup'
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (mode === "signup") {
      if (!username.trim() || !password.trim()) {
        alert("Remplis pseudo et mot de passe !");
        return;
      }
      if (users[username]) {
        alert("Ce pseudo existe déjà !");
        return;
      }
      // Créer le compte
      users[username] = { password };
      localStorage.setItem("users", JSON.stringify(users));
      alert("Compte créé ! Tu peux maintenant te connecter.");
      setMode("login");
      setUsername("");
      setPassword("");
    } else {
      // Login
      if (!users[username] || users[username].password !== password) {
        alert("Identifiant ou mot de passe incorrect !");
        return;
      }
      // Connexion réussie
      localStorage.setItem("playerName", username);
      navigate("/hubjeux");
    }
  };

  return (
    <>
      <style>{`
        /* 🌌 Reset global pour tout couvrir */
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          font-family: 'Poppins', sans-serif;
          overflow: hidden; /* empêche le scroll si gradient dépasse */
        }

        /* 🌠 Fond animé */
        body::before {
          content: "";
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at top, #0a0a2a, #030314, #0a0a2a);
          background-size: 400% 400%;
          animation: gradientMove 15s ease infinite;
          z-index: -1;
        }

        @keyframes gradientMove {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }

        /* 🧱 Conteneur login centré */
        .login-container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
        }

        /* 📝 Boîte login */
        .login-box {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 40px 60px;
          box-shadow: 0 0 25px rgba(0, 0, 0, 0.5);
          text-align: center;
          width: 340px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .login-box:hover {
          transform: translateY(-5px);
          box-shadow: 0 0 35px rgba(0, 180, 255, 0.3);
        }

        /* 🔤 Titre */
        .login-title {
          font-size: 28px;
          margin-bottom: 25px;
          background: linear-gradient(90deg, #00d4ff, #00ffaa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        /* ✏️ Inputs */
        .input-group {
          margin-bottom: 20px;
        }

        .login-input {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 10px;
          background-color: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 16px;
          outline: none;
          text-align: center;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .login-input:focus {
          background-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 10px #00d4ff;
        }

        /* 🔘 Bouton */
        .login-button {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(90deg, #00d4ff, #00ffaa);
          color: #000;
          font-size: 17px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .login-button:hover {
          background: linear-gradient(90deg, #00ffaa, #00d4ff);
          transform: scale(1.05);
        }

        /* 🧍 Texte bas */
        .signup-text {
          margin-top: 20px;
          font-size: 14px;
          color: #ccc;
        }

        .signup-link {
          color: #00d4ff;
          cursor: pointer;
          text-decoration: underline;
          transition: color 0.3s ease;
        }

        .signup-link:hover {
          color: #00ffaa;
        }
      `}</style>

      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">{mode === "login" ? "Connexion" : "Inscription"}</h1>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
              />
            </div>

            <button type="submit" className="login-button">
              {mode === "login" ? "Se connecter" : "S'inscrire"}
            </button>
          </form>

          <p className="signup-text">
            {mode === "login" ? "Nouveau joueur ?" : "Déjà un compte ?"}{" "}
            <span
              className="signup-link"
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setUsername("");
                setPassword("");
              }}
            >
              {mode === "login" ? "Créer un compte" : "Se connecter"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
