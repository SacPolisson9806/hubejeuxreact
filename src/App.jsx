import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hubjeux from "./hubjeux";
import Connexion from "./connexion";
import QuizzSolo from "./quizz/quizzSolo";
import QuizzMulti from "./quizz/quizzmulti";
import StartquizzSolo from "./quizz/startquizzsolo";
import StartquizzMulti from "./quizz/startquizzmulti";
import Jeuxpendu from "./jeuxpendu/jeuxpendu";
import Voiture from "./voiture/voiture";
import Accueil from "./voiture/accueil";
import Codecrackerindex from "./codecracker/codecrackerindex";
import Codecracker from "./codecracker/codecracker";
import Chiffremystere from "./chiffremystere/chiffremystere";
import Cemantixgame from "./cemantix/cemantixgame";
import Cemantix from "./cemantix/cemantix";
import Arrowrushaccueil from "./arrowrush/arrowrushaccueil";
import Arrowrushgame from "./arrowrush/arrowrushgame";
import Index2048 from "./2048/index2048";
import Game2048 from "./2048/game2048";
import Sudokuaccueil from "./sudoku/sudokuaccueil";
import Sudokugame from "./sudoku/sudokugame";
import "./app.css";


export default function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Hubjeux />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/quizzSolo" element={<QuizzSolo />} />
        <Route path="/quizzMulti" element={<QuizzMulti />} />
        <Route path="/Startquizzsolo" element={<StartquizzSolo />} />
        <Route path="/Startquizzmulti" element={<StartquizzMulti />} />
        <Route path="/Jeuxpendu" element={<Jeuxpendu />} />
        <Route path="/voiture" element={<Voiture />} />
        <Route path="/Accueil" element={<Accueil />} />
        <Route path="/Codecrackerindex" element={<Codecrackerindex />} />
        <Route path="/Codecracker" element={<Codecracker />} />
        <Route path="/Chiffremystere" element={<Chiffremystere />} />
        <Route path="/Cemantixgame" element={<Cemantixgame />} />
        <Route path="/Cemantix" element={<Cemantix />} />
        <Route path="/Arrowrushaccueil" element={<Arrowrushaccueil />} />
        <Route path="/Arrowrushgame" element={<Arrowrushgame />} />
        <Route path="/Index2048" element={<Index2048 />} />
        <Route path="/Game2048" element={<Game2048 />} />
        <Route path="/sudokuaccueil" element={<Sudokuaccueil />} />
        <Route path="/sudokugame" element={<Sudokugame />} />

      </Routes>
  
  );
}
