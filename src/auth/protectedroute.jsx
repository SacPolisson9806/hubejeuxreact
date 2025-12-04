// protectedroute.jsx
/**
 * ProtectedRoute avec 2FA prêt à l'emploi
 *
 * 🔹 Fonctionnalités :
 * - Vérifie token JWT depuis AuthContext ou localStorage
 * - Gère un flag `twoFAValidated` pour activer la 2FA plus tard
 * - Redirige vers login si pas de token
 * - Redirige vers 2FA si token présent mais 2FA non validé (désactivé pour l'instant)
 */

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./authcontext.jsx";

export default function ProtectedRoute({ children }) {
  const { token, twoFAValidated } = useContext(AuthContext);

  // 🔹 Si pas de token → redirection vers page de connexion
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 🔹 Vérification 2FA (désactivée pour le moment)
  // Quand tu voudras activer la 2FA, décommente cette ligne :
  // if (!twoFAValidated) return <Navigate to="/twofa" replace />;

  // 🔹 Sinon, route accessible
  return children;
}
