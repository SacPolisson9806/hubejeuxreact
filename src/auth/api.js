// ============================================================
//  api.js → Fichier de requêtes HTTP sécurisé
//  À placer dans : src/auth/api.js
//
//  ➤ Centralise toutes les communications entre ton frontend React
//    et ton backend (Node / Express / server.js).
//
//  ➤ Avantages :
//      - Code plus propre
//      - Token automatiquement ajouté
//      - Gère la déconnexion auto si token expiré
//      - Moins d’erreurs dans les pages
//      - Plus sécurisé
// ============================================================


// ------------------------------------------------------------
// 1) Adresse du backend
// ------------------------------------------------------------
// Mets l’adresse de ton backend ici :
//  - en local → http://localhost:3001
//  - en ligne → https://monsite.com/api
const BASE_URL = "http://localhost:3001";


// ------------------------------------------------------------
// 2) Fonction pour récupérer le token JWT depuis le navigateur
// ------------------------------------------------------------
// Le token est stocké dans localStorage quand l’utilisateur se connecte.
// Si on ne le récupère pas ici → impossible de protéger les pages.
const getToken = () => {
  try {
    return localStorage.getItem("token");
  } catch (e) {
    console.error("Impossible de lire le token", e);
    return null;
  }
};


// ==================================================================
// 3) Méthode GET sécurisée (lecture de données)
// ==================================================================
export const apiGet = async (endpoint) => {
  const token = getToken(); // Récupération du token JWT

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Le token est automatiquement mis dans l’en-tête HTTP
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    // Si le token n'est plus valide → on déconnecte automatiquement
    if (res.status === 401) handleUnauthorized();

    return await res.json();
  } catch (err) {
    console.error("Erreur API GET :", err);
    return { error: "Serveur injoignable" };
  }
};


// ==================================================================
// 4) Méthode POST sécurisée (envoyer des données, login, signup, etc.)
// ==================================================================
export const apiPost = async (endpoint, body = {}) => {
  const token = getToken();

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(body),
    });

    if (res.status === 401) handleUnauthorized();

    return await res.json();
  } catch (err) {
    console.error("Erreur API POST :", err);
    return { error: "Serveur injoignable" };
  }
};


// ==================================================================
// 5) Méthode PUT sécurisée (mise à jour → changer mot de passe, email...)
// ==================================================================
export const apiPut = async (endpoint, body = {}) => {
  const token = getToken();

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(body),
    });

    if (res.status === 401) handleUnauthorized();

    return await res.json();
  } catch (err) {
    console.error("Erreur API PUT :", err);
    return { error: "Serveur injoignable" };
  }
};


// ------------------------------------------------------------
// 6) Déconnexion automatique quand le token expire
// ------------------------------------------------------------
// ➤ Le backend renvoie "401 Unauthorized" si :
//      - le token est expiré
//      - le token est invalide
//      - le token a été supprimé côté serveur
//
// ➤ On supprime alors les infos du joueur + on le renvoie au login
function handleUnauthorized() {
  console.warn("Token expiré → déconnexion automatique.");

  localStorage.removeItem("token");
  localStorage.removeItem("playerName");

  window.location.href = "/login";
}
