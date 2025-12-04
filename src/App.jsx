import React from "react";
import { Routes, Route } from "react-router-dom";
import useAutoLogout from "./UseAutoLogout.jsx";
import LogoutWarning from "./Logoutwarning.jsx";

// Pages publiques
import Login from "./auth/login.jsx";
import Connexion from "./connexion";
import Signup from "./auth/signup.jsx";

// Pages protégées
import Hubjeux from "./hubjeux";
import Changepassword from "./auth/changepassword.jsx";
import Profile from "./profile.jsx";
import Twofa from "./auth/twofa.jsx";

// Jeux
import QuizzSolo from "./quizz/quizzsolo";
import QuizzMulti from "./quizz/quizzmulti";
import StartquizzSolo from "./quizz/startquizzsolo.jsx";
import StartquizzMulti from "./quizz/startquizzmulti";
import Jeuxpendu from "./jeuxpendu/jeuxpendu";
import Voiture from "./voiture/voiture";
import Accueil from "./voiture/accueil";
import Codecrackerindex from "./codecracker/codecrackerindex";
import Codecracker from "./codecracker/codecracker";
import Chiffremystere from "./chiffremystere/chiffremystere";
import Chiffremystereaccueil from "./chiffremystere/chiffremystereaccueil";
import Cemantixgame from "./cemantix/cemantixgame";
import Cemantix from "./cemantix/cemantix";
import Arrowrushaccueil from "./arrowrush/arrowrushaccueil";
import Arrowrushgame from "./arrowrush/arrowrushgame";
import Index2048 from "./2048/index2048";
import Game2048 from "./2048/game2048";
import Sudokuaccueil from "./sudoku/sudokuaccueil";
import Sudokugame from "./sudoku/sudokugame";
import Leaderboard from "./Leaderboard.jsx";
import ChiffreMystereLeaderboard from "./chiffremystere/chiffremystereleaderboard.jsx";
import Quete from "./quete.jsx";
import Quetemedaillon from "./quetemedaillon.jsx";
import Snake from "./snake/snake";

// Contexte auth et route protégée
import ProtectedRoute from "./auth/protectedroute.jsx";

export default function App() {
  const { showWarning, countdown, resetTimer } = useAutoLogout();

  return (
    <>
      {/* Popup de déconnexion automatique */}
      {showWarning && <LogoutWarning countdown={countdown} onStayConnected={resetTimer} />}

      <Routes>
        {/* ======================= */}
        {/* Routes publiques */}
        {/* ======================= */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/twofa" element={<Twofa />} /> {/* pour futur 2FA */}

        {/* ======================= */}
        {/* Routes protégées : utilisateur connecté obligatoire */}
        {/* ======================= */}
        <Route path="/hubjeux" element={<ProtectedRoute><Hubjeux /></ProtectedRoute>} />
        <Route path="/changepassword" element={<ProtectedRoute><Changepassword /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* ======================= */}
        {/* Jeux et pages sensibles protégées */}
        {/* ======================= */}
        <Route path="/quizzsolo" element={<ProtectedRoute><QuizzSolo /></ProtectedRoute>} />
        <Route path="/quizzmulti" element={<ProtectedRoute><QuizzMulti /></ProtectedRoute>} />
        <Route path="/startquizzsolo" element={<ProtectedRoute><StartquizzSolo /></ProtectedRoute>} />
        <Route path="/startquizzmulti" element={<ProtectedRoute><StartquizzMulti /></ProtectedRoute>} />
        <Route path="/jeuxpendu" element={<ProtectedRoute><Jeuxpendu /></ProtectedRoute>} />
        <Route path="/voiture" element={<ProtectedRoute><Voiture /></ProtectedRoute>} />
        <Route path="/accueil" element={<ProtectedRoute><Accueil /></ProtectedRoute>} />
        <Route path="/codecrackerindex" element={<ProtectedRoute><Codecrackerindex /></ProtectedRoute>} />
        <Route path="/codecracker" element={<ProtectedRoute><Codecracker /></ProtectedRoute>} />
        <Route path="/chiffremystere" element={<ProtectedRoute><Chiffremystere /></ProtectedRoute>} />
        <Route path="/chiffremystereaccueil" element={<ProtectedRoute><Chiffremystereaccueil /></ProtectedRoute>} />
        <Route path="/cemantixgame" element={<ProtectedRoute><Cemantixgame /></ProtectedRoute>} />
        <Route path="/cemantix" element={<ProtectedRoute><Cemantix /></ProtectedRoute>} />
        <Route path="/arrowrushaccueil" element={<ProtectedRoute><Arrowrushaccueil /></ProtectedRoute>} />
        <Route path="/arrowrushgame" element={<ProtectedRoute><Arrowrushgame /></ProtectedRoute>} />
        <Route path="/index2048" element={<ProtectedRoute><Index2048 /></ProtectedRoute>} />
        <Route path="/game2048" element={<ProtectedRoute><Game2048 /></ProtectedRoute>} />
        <Route path="/sudokuaccueil" element={<ProtectedRoute><Sudokuaccueil /></ProtectedRoute>} />
        <Route path="/sudokugame" element={<ProtectedRoute><Sudokugame /></ProtectedRoute>} />
        <Route path="/Leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/chiffremystereleaderboard" element={<ProtectedRoute><ChiffreMystereLeaderboard /></ProtectedRoute>} />
        <Route path="/quete" element={<ProtectedRoute><Quete /></ProtectedRoute>} />
        <Route path="/quetemedaillon" element={<ProtectedRoute><Quetemedaillon /></ProtectedRoute>} />
        <Route path="/snake" element={<ProtectedRoute><Snake /></ProtectedRoute>} />
        <Route path="/connexion" element={<ProtectedRoute><Connexion /></ProtectedRoute>} />
      </Routes>
    </>
  );
}
