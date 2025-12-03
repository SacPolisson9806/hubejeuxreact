/**
 * Signup.jsx
 * Page d'inscription sécurisée
 * - Récupère pseudo, mot de passe et email
 * - Vérifie que les champs sont remplis
 * - Envoie les données vers le backend
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // 🔹 nouveau champ email
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const server = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || !email.trim()) {
      showMessage("Remplis pseudo, email et mot de passe !", "error");
      return;
    }

    // Optionnel : vérification format email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showMessage("Email invalide", "error");
      return;
    }

    try {
      const response = await fetch(`${server}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      const data = await response.json();
      if (data.success) {
        showMessage(data.message, "success");
        setTimeout(() => navigate("/login"), 1000); // redirection vers login
      } else {
        showMessage(data.message, "error");
      }
    } catch (err) {
      console.error(err);
      showMessage("Erreur serveur, réessaie plus tard.", "error");
    }
  };

  return (
    <div className="login-container">
      {message && <div className={`notification ${messageType}`}>{message}</div>}
      <div className="login-box">
        <h1 className="login-title">Créer un compte</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>

          <button type="submit" className="login-button">
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
}
