/**
 * protectedroute.jsx
 *
 * 🔹 But :
 *   Permet de protéger certaines pages : seuls les utilisateurs authentifiés
 *   et ayant validé leur 2FA peuvent accéder.
 *
 * 🔹 Fonctionnement :
 *   1. Vérifie la présence du token dans AuthContext ou localStorage.
 *   2. Vérifie un flag `twoFAValidated` (à définir après réussite 2FA).
 *   3. Si non validé → redirige vers Login ou 2FA selon le cas.
 *
 * 🔹 Sécurité :
 *   - Protection frontend des routes
 *   - Token JWT pour identification
 *   - Intégration possible avec 2FA
 */

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./authcontext.jsx";

export default function ProtectedRoute({ children }) {
  const { token, twoFAValidated } = useContext(AuthContext);

  // 🔹 Si pas de token, redirige vers page de connexion
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 🔹 Si token présent mais 2FA pas validé, redirige vers 2FA
  if (!twoFAValidated) {
    return <Navigate to="/twofa" replace />;
  }

  // 🔹 Sinon, route accessible
  return children;
}
