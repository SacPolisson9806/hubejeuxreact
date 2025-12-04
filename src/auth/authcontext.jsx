// authcontext.jsx
/**
 * ===============================================
 * 🔐 CONTEXTE GLOBAL D'AUTHENTIFICATION (React)
 * ===============================================
 *
 * Sert à :
 * - stocker l'utilisateur actuellement connecté
 * - stocker le token JWT renvoyé par le backend
 * - permettre aux composants d'appeler login() et logout()
 * - garder la connexion active même en rechargeant la page
 *
 * Ce fichier gère à lui SEUL toute l'authentification du frontend.
 */

import React, { createContext, useState, useEffect } from "react";

// 🔹 Création du contexte disponible partout dans l'app
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // =============================
  // 🔹 États globaux du contexte
  // =============================

  // Pseudo de l'utilisateur connecté
  const [user, setUser] = useState(null);

  // Token JWT du backend (permet d'accéder aux routes protégées)
  const [token, setToken] = useState(null);

  // =======================================================
  // 🔹 Chargement automatique depuis localStorage au démarrage
  // Permet de rester connecté même après F5 (actualisation)
  // =======================================================
  useEffect(() => {
    const savedUser = localStorage.getItem("playerName");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
    }
  }, []);

  // ==========================
  // 🔹 Fonction LOGIN utilisateur
  // ==========================
  const login = (username, tokenValue) => {
    // Met à jour l'état global
    setUser(username);
    setToken(tokenValue);

    // Stocke pour persistance
    localStorage.setItem("playerName", username);
    localStorage.setItem("token", tokenValue);

    // 🔥 IMPORTANT :
    // On retourne true pour confirmer que la connexion s'est bien faite.
    // Cela permet au composant Login.jsx de rediriger immédiatement.
    return true;
  };

  // ==========================
  // 🔹 Fonction LOGOUT utilisateur
  // ==========================
  const logout = () => {
    // Réinitialise l'état
    setUser(null);
    setToken(null);

    // Supprime du stockage local
    localStorage.removeItem("playerName");
    localStorage.removeItem("token");

    return true; // pas obligatoire, mais propre
  };

  // ================================
  // 🔹 Fournit les valeurs globales
  // ================================
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
