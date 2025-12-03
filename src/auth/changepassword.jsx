/**
 * changepassword.jsx
 *
 * 🔹 But :
 *   Page pour permettre aux utilisateurs de changer leur mot de passe.
 *
 * 🔹 Fonctionnement :
 *   1. L'utilisateur entre l'ancien mot de passe, le nouveau et sa confirmation.
 *   2. Vérifications côté frontend : longueur, chiffres, majuscules, correspondance.
 *   3. Envoi au backend (/change-password) avec token JWT pour authentification.
 *   4. Backend valide l'ancien mot de passe et met à jour le nouveau.
 *
 * 🔹 Sécurité :
 *   - Vérification mot de passe fort (RGPD)
 *   - Token JWT pour authentification
 *   - Les comptes spéciaux (admin/test) peuvent bypasser certaines contraintes pour le dev
 */

import React, { useState, useContext } from "react";
import { AuthContext } from "./authcontext.jsx";

export default function ChangePassword() {
  const { token, username } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const server = import.meta.env.VITE_API_URL;

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  // Vérification mot de passe fort (8+ caractères, majuscule, chiffre)
  const validatePassword = (pwd) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      showMessage("Tous les champs sont requis", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage("Les nouveaux mots de passe ne correspondent pas", "error");
      return;
    }

    if (!validatePassword(newPassword)) {
      showMessage("Mot de passe trop faible : 8+ caractères, au moins 1 majuscule et 1 chiffre", "error");
      return;
    }

    try {
      const response = await fetch(`${server}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, oldPassword, newPassword }),
      });

      const data = await response.json();

      if (data.success) {
        showMessage("Mot de passe changé avec succès !", "success");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showMessage(data.message, "error");
      }
    } catch (err) {
      console.error(err);
      showMessage("Erreur serveur, réessayez plus tard.", "error");
    }
  };

  return (
    <>
      <style>{`
        html, body { margin:0; padding:0; height:100%; width:100%; font-family:'Poppins',sans-serif; background: radial-gradient(circle at top,#0a0a2a,#030314,#0a0a2a); color:white; display:flex; justify-content:center; align-items:center; }
        .changepw-box { background: rgba(255,255,255,0.05); backdrop-filter: blur(15px); border:1px solid rgba(255,255,255,0.1); border-radius:20px; padding:40px 60px; width:340px; text-align:center; box-shadow:0 0 25px rgba(0,0,0,0.5); }
        .changepw-title { font-size:28px; margin-bottom:25px; background: linear-gradient(90deg,#00d4ff,#00ffaa); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
        .changepw-input { width:100%; padding:12px; border:none; border-radius:10px; background-color:rgba(255,255,255,0.1); color:white; font-size:16px; margin-bottom:20px; outline:none; text-align:center; transition: all 0.3s ease; }
        .changepw-input:focus { background-color: rgba(255,255,255,0.2); box-shadow:0 0 10px #00d4ff; }
        .changepw-button { width:100%; padding:12px; border:none; border-radius:10px; background: linear-gradient(90deg,#00d4ff,#00ffaa); color:#000; font-size:17px; font-weight:bold; cursor:pointer; transition: all 0.3s ease; }
        .changepw-button:hover { background: linear-gradient(90deg,#00ffaa,#00d4ff); transform: scale(1.05); }
        .notification { position:absolute; top:20px; left:50%; transform:translateX(-50%); padding:15px 25px; border-radius:10px; font-weight:bold; color:white; z-index:999; box-shadow:0 0 15px rgba(0,0,0,0.3); animation:fadein 0.3s, fadeout 0.3s 3.7s; }
        .notification.success { background: #00bfff; }
        .notification.error { background: #ff4c4c; }
        @keyframes fadein { from{opacity:0;} to{opacity:1;} }
        @keyframes fadeout { from{opacity:1;} to{opacity:0;} }
      `}</style>

      <div className="changepw-box">
        {message && <div className={`notification ${messageType}`}>{message}</div>}
        <h1 className="changepw-title">Changer le mot de passe</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Ancien mot de passe"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="changepw-input"
          />
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="changepw-input"
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="changepw-input"
          />
          <button type="submit" className="changepw-button">Valider</button>
        </form>
      </div>
    </>
  );
}
