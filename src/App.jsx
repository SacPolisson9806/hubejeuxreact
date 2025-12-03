import React from "react";
import { Routes, Route } from "react-router-dom";
import useAutoLogout from "./UseAutoLogout.jsx";
import LogoutWarning from "./Logoutwarning.jsx";

// Pages
import Hubjeux from "./hubjeux";
import Connexion from "./connexion";
import Login from "./auth/login.jsx";
import { AuthContext } from "./auth/authcontext.jsx";
import Changepassword from "./auth/changepassword.jsx";
import ProtectedRoute from "./auth/protectedroute.jsx";
import Signup from "./auth/signup.jsx";
import Twofa from "./auth/twofa.jsx";
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
import Profile from "./profile.jsx";
import Quete from "./quete.jsx";
import Quetemedaillon from "./quetemedaillon.jsx";
import Snake from "./snake/snake";

export default function App() {
  const { showWarning, countdown, resetTimer } = useAutoLogout();

  return (
    <>
      {/* Popup de déconnexion automatique */}
      {showWarning && <LogoutWarning countdown={countdown} onStayConnected={resetTimer} />}

      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Login />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/twofa" element={<Twofa />} />

        {/* Routes protégées avec ProtectedRoute */}
        <Route path="/hubjeux" element={<ProtectedRoute><Hubjeux /></ProtectedRoute>} />
        <Route path="/changepassword" element={<ProtectedRoute><Changepassword /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Autres pages */}
        <Route path="/quizzsolo" element={<QuizzSolo />} />
        <Route path="/quizzmulti" element={<QuizzMulti />} />
        <Route path="/startquizzsolo" element={<StartquizzSolo />} />
        <Route path="/startquizzmulti" element={<StartquizzMulti />} />
        <Route path="/jeuxpendu" element={<Jeuxpendu />} />
        <Route path="/voiture" element={<Voiture />} />
        <Route path="/accueil" element={<Accueil />} />
        <Route path="/codecrackerindex" element={<Codecrackerindex />} />
        <Route path="/codecracker" element={<Codecracker />} />
        <Route path="/chiffremystere" element={<Chiffremystere />} />
        <Route path="/chiffremystereaccueil" element={<Chiffremystereaccueil />} />
        <Route path="/cemantixgame" element={<Cemantixgame />} />
        <Route path="/cemantix" element={<Cemantix />} />
        <Route path="/arrowrushaccueil" element={<Arrowrushaccueil />} />
        <Route path="/arrowrushgame" element={<Arrowrushgame />} />
        <Route path="/index2048" element={<Index2048 />} />
        <Route path="/game2048" element={<Game2048 />} />
        <Route path="/sudokuaccueil" element={<Sudokuaccueil />} />
        <Route path="/sudokugame" element={<Sudokugame />} />
        <Route path="/Leaderboard" element={<Leaderboard />} />
        <Route path="/chiffremystereleaderboard" element={<ChiffreMystereLeaderboard />} />
        <Route path="/quete" element={<Quete />} />
        <Route path="/quetemedaillon" element={<Quetemedaillon />} />
        <Route path="/snake" element={<Snake />} />
      </Routes>
    </>
  );
}
