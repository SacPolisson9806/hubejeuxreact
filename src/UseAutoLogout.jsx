import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const AUTO_LOGOUT_TIME = 15 * 60 * 1000; // 15 minutes (pour tester, mettre 10000 = 10s)
const WARNING_TIME = 1 * 60 * 1000;      // 1 minute avant déconnexion

export default function useAutoLogout() {
  const navigate = useNavigate();
  const timer = useRef();
  const warningTimer = useRef();
  const countdownTimer = useRef();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const logoutUser = () => {
    localStorage.removeItem("token"); // supprime token/session
    navigate("/login");               // redirige vers login
  };

  const startCountdown = () => {
    let timeLeft = WARNING_TIME / 1000; // secondes
    setCountdown(timeLeft);

    countdownTimer.current = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      if (timeLeft <= 0) clearInterval(countdownTimer.current);
    }, 1000);
  };

  const resetTimer = () => {
    setShowWarning(false);
    if (timer.current) clearTimeout(timer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);

    // Timer pour afficher le modal
    warningTimer.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, AUTO_LOGOUT_TIME - WARNING_TIME);

    // Timer pour la déconnexion finale
    timer.current = setTimeout(logoutUser, AUTO_LOGOUT_TIME);
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach(e => document.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      events.forEach(e => document.removeEventListener(e, resetTimer));
      if (timer.current) clearTimeout(timer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
      if (countdownTimer.current) clearInterval(countdownTimer.current);
    };
  }, []);

  return { showWarning, countdown, resetTimer };
}
