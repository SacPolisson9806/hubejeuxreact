/**
 * authcontext.jsx
 *
 * 🔹 But :
 *   Fournir un contexte global pour gérer l'authentification dans l'application React.
 *   Cela permet de centraliser :
 *     - L'état de l'utilisateur (connecté ou non)
 *     - Le stockage et la récupération du token JWT
 *     - Les fonctions de login et logout
 *
 * 🔹 Fonctionnement :
 *   1. Lorsqu'un utilisateur se connecte via login.jsx, on appelle `login(username, token)` :
 *        - Le pseudo (username) et le token JWT sont stockés dans localStorage
 *        - L'état global `user` est mis à jour
 *
 *   2. Lorsqu'un utilisateur se déconnecte, on appelle `logout()` :
 *        - Le token et le pseudo sont supprimés de localStorage
 *        - L'état global `user` est réinitialisé à null
 *
 *   3. Au chargement de l'application, `useEffect` vérifie si un utilisateur est déjà logué :
 *        - Si oui, il restaure l'état `user` à partir de localStorage
 *
 * 🔹 Utilisation :
 *   - Entourer votre App.jsx avec <AuthProvider> pour que tous les composants enfants puissent accéder au contexte.
 *   - Utiliser `useContext(AuthContext)` pour récupérer `user`, `login` et `logout`.
 *
 * 🔹 Exemple :
 *   const { user, login, logout } = useContext(AuthContext);
 */

import React, { createContext, useState, useEffect } from "react";

// Création du contexte d'authentification
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // État global de l'utilisateur
  const [user, setUser] = useState(null);

  // Fonction pour connecter l'utilisateur
  const login = (username, token) => {
    // Stockage du pseudo et du token dans localStorage
    localStorage.setItem("playerName", username);
    localStorage.setItem("token", token);
    setUser({ username, token });
  };

  // Fonction pour déconnecter l'utilisateur
  const logout = () => {
    // Suppression du pseudo et du token
    localStorage.removeItem("playerName");
    localStorage.removeItem("token");
    setUser(null);
  };

  // Vérification automatique à chaque chargement si l'utilisateur est déjà logué
  useEffect(() => {
    const username = localStorage.getItem("playerName");
    const token = localStorage.getItem("token");
    if (username && token) setUser({ username, token });
  }, []);

  // Fournir le contexte à tous les composants enfants
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
