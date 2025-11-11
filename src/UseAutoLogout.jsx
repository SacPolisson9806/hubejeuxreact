// Import des hooks React
import { useEffect, useRef, useState } from "react";
// Import de useNavigate pour pouvoir rediriger l’utilisateur
import { useNavigate, useLocation } from "react-router-dom";

// 🕒 Configuration du temps d’inactivité et de l’avertissement
const AUTO_LOGOUT_TIME = 15 * 60 * 1000; // 15 minutes (pour tester: 10000 = 10s)
const WARNING_TIME = 1 * 60 * 1000;      // 1 minute avant la déconnexion

export default function useAutoLogout() {
  // Pour rediriger l’utilisateur (vers /login)
  const navigate = useNavigate();
  // Pour connaître la page actuelle (utile pour désactiver le timer sur /login)
  const location = useLocation();

  // useRef = références persistantes (les timers)
  const timer = useRef();           // Timer principal (déconnexion)
  const warningTimer = useRef();    // Timer d’affichage du modal
  const countdownTimer = useRef();  // Timer pour le compte à rebours

  // useState = variables réactives
  const [showWarning, setShowWarning] = useState(false); // Afficher / cacher le modal
  const [countdown, setCountdown] = useState(0);         // Temps restant avant déconnexion

  /**
   * 🔐 Fonction de déconnexion complète
   * - Ferme le modal
   * - Nettoie tous les timers
   * - Supprime la session
   * - Redirige vers la page de login
   */
  const logoutUser = () => {
    console.log("Utilisateur déconnecté automatiquement");

    // Ferme le modal si visible
    setShowWarning(false);

    // Nettoyage complet des timers
    if (timer.current) clearTimeout(timer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);

    // Supprime le token / session de l’utilisateur
    localStorage.removeItem("token");

    // Redirige vers la page de connexion
    navigate("/");
  };

  /**
   * ⏱️ Fonction qui démarre le compte à rebours visible dans le modal
   */
  const startCountdown = () => {
    let timeLeft = WARNING_TIME / 1000; // conversion en secondes
    setCountdown(timeLeft);

    // Chaque seconde, on diminue de 1 et on met à jour l’état
    countdownTimer.current = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);

      // Si le temps est écoulé, on arrête le compte à rebours
      if (timeLeft <= 0) clearInterval(countdownTimer.current);
    }, 1000);
  };

  /**
   * ♻️ Fonction pour réinitialiser les timers à chaque activité utilisateur
   * (souris, clavier, clic, toucher)
   */
  const resetTimer = () => {
    // Si le modal était visible, on le cache
    setShowWarning(false);

    // Nettoyage des timers précédents
    if (timer.current) clearTimeout(timer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);

    // 🧠 Si l’utilisateur est sur la page de login, on ne lance pas le timer
    if (location.pathname === "/" || location.pathname === "/") {
      return;
    }

    // Timer d’avertissement : affiche le modal avant la déconnexion
    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, AUTO_LOGOUT_TIME - WARNING_TIME);

    // Timer principal : déconnecte après le délai d’inactivité
    timer.current = setTimeout(logoutUser, AUTO_LOGOUT_TIME);
  };

  /**
   * ⚙️ useEffect : met en place les écouteurs d’événements et les timers
   */
  useEffect(() => {
    // Liste des événements considérés comme une "activité"
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];

    // À chaque activité utilisateur → on réinitialise le timer
    events.forEach(e => document.addEventListener(e, resetTimer));

    // Lancement initial du timer
    resetTimer();

    // 🧹 Nettoyage quand le composant est démonté
    return () => {
      events.forEach(e => document.removeEventListener(e, resetTimer));
      if (timer.current) clearTimeout(timer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
      if (countdownTimer.current) clearInterval(countdownTimer.current);
    };
  // On relance l’effet si la route change
  }, [location.pathname]);

  /**
   * 🧩 On retourne les infos nécessaires à l’application :
   * - showWarning → affiche ou non le modal
   * - countdown → nombre de secondes restantes
   * - resetTimer → permet au bouton "Je reste connecté" de relancer le timer
   */
  return { showWarning, countdown, resetTimer };
}
