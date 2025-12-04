// authcontext.jsx
/**
 * ===============================================
 * 🔐 CONTEXTE GLOBAL D'AUTHENTIFICATION (React)
 * ===============================================
 *
 * Objectif :
 * - Stocker l'utilisateur connecté et son token JWT
 * - Fournir login() et logout() à toute l'application
 * - Persister la connexion via localStorage
 * - Préparer le support pour la 2FA (flag twoFAValidated)
 *
 * Utilisation future pour 2FA :
 * - Ajouter un état `twoFAValidated` (false par défaut)
 * - Ajouter une fonction `validate2FA()` pour l'activer après succès 2FA
 * - Les ProtectedRoute pourront vérifier `twoFAValidated` avant d'autoriser l'accès
 */

import React, { createContext, useState, useEffect } from "react";

// 🔹 Création du contexte global
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 🔹 États globaux
  const [user, setUser] = useState(null); // Pseudo utilisateur
  const [token, setToken] = useState(null); // Token JWT
  const [twoFAValidated, setTwoFAValidated] = useState(false); // Flag 2FA (prêt pour future implémentation)

  // 🔹 Chargement automatique depuis localStorage au démarrage
  useEffect(() => {
    const savedUser = localStorage.getItem("playerName");
    const savedToken = localStorage.getItem("token");
    const saved2FA = localStorage.getItem("twoFAValidated") === "true"; // si tu veux persister la 2FA plus tard

    if (savedUser && savedToken) {
      setUser(savedUser);
      setToken(savedToken);
      setTwoFAValidated(saved2FA);
    }
  }, []);

  // 🔹 Connexion utilisateur
  const login = (username, tokenValue) => {
    setUser(username);
    setToken(tokenValue);
    setTwoFAValidated(false); // reset 2FA à false à chaque nouvelle connexion

    localStorage.setItem("playerName", username);
    localStorage.setItem("token", tokenValue);
    localStorage.setItem("twoFAValidated", "false");

    return true;
  };

  // 🔹 Déconnexion utilisateur
  const logout = () => {
    setUser(null);
    setToken(null);
    setTwoFAValidated(false);

    localStorage.removeItem("playerName");
    localStorage.removeItem("token");
    localStorage.removeItem("twoFAValidated");

    return true;
  };

  // 🔹 Valider la 2FA (à appeler après succès 2FA)
  const validate2FA = () => {
    setTwoFAValidated(true);
    localStorage.setItem("twoFAValidated", "true");
  };

  // 🔹 Fournit toutes les valeurs et fonctions globales
  return (
    <AuthContext.Provider value={{ user, token, twoFAValidated, login, logout, validate2FA }}>
      {children}
    </AuthContext.Provider>
  );
};
