// src/pages/SudokuGame.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function SudokuGame() {
  // 🔹 Permet de lire les paramètres dans l’URL (ici "size")
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 🔹 Taille du sudoku (ex: 3 → sudoku 9x9, 2 → sudoku 4x4)
  const blockGridSize = parseInt(searchParams.get('size')) || 3;
  const blockSize = blockGridSize; 
  const gridSize = blockGridSize * blockSize; // ex : 3x3 = 9 cases par ligne/colonne

  // 🔹 Grille de jeu (tableau de cellules)
  const [grid, setGrid] = useState([]);

  // 🔹 Génère une grille vide (initialisation)
  const generateEmptyGrid = () =>
    Array(gridSize).fill().map(() =>
      Array(gridSize).fill({ value: '', fixed: false, error: false })
    );

  // 🔹 Vérifie si une valeur peut être placée dans une case
  const isSafe = (preset, row, col, val) => {
    // Vérifie la ligne et la colonne
    for (let i = 0; i < gridSize; i++) {
      if (preset[row][i] === val) return false;
      if (preset[i][col] === val) return false;
    }

    // Vérifie le bloc (sous-grille)
    const startRow = Math.floor(row / blockSize) * blockSize;
    const startCol = Math.floor(col / blockSize) * blockSize;
    for (let r = startRow; r < startRow + blockSize; r++) {
      for (let c = startCol; c < startCol + blockSize; c++) {
        if (preset[r][c] === val) return false;
      }
    }
    return true;
  };

  // 🔹 Remplit quelques cases au hasard pour créer une grille de départ
  const fillPresetRandomly = () => {
    const newPreset = Array(gridSize).fill().map(() => Array(gridSize).fill(''));

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        if (Math.random() < 0.15) { // ~15% des cases remplies
          for (let tries = 0; tries < 20; tries++) {
            const val = Math.floor(Math.random() * gridSize) + 1;
            if (isSafe(newPreset, r, c, val)) {
              newPreset[r][c] = val;
              break;
            }
          }
        }
      }
    }

    // Convertit les valeurs en objets de cellule
    const visualGrid = newPreset.map(row =>
      row.map(val => ({
        value: val ? String(val) : '',
        fixed: !!val, // true si la valeur est prédéfinie
        error: false
      }))
    );
    setGrid(visualGrid);
  };

  // 🔹 Vérifie si la grille respecte les règles du Sudoku
  const validateGrid = () => {
    const newGrid = grid.map((row, r) =>
      row.map((cell, c) => {
        if (!cell.value) return { ...cell, error: false };
        let error = false;
        const val = cell.value;

        // Vérifie doublons dans la ligne et la colonne
        for (let i = 0; i < gridSize; i++) {
          if (i !== c && grid[r][i].value === val) error = true;
          if (i !== r && grid[i][c].value === val) error = true;
        }

        // Vérifie doublons dans le bloc
        const startRow = Math.floor(r / blockSize) * blockSize;
        const startCol = Math.floor(c / blockSize) * blockSize;
        for (let i = startRow; i < startRow + blockSize; i++) {
          for (let j = startCol; j < startCol + blockSize; j++) {
            if ((i !== r || j !== c) && grid[i][j].value === val) error = true;
          }
        }

        return { ...cell, error };
      })
    );

    setGrid(newGrid);

    // 🔹 Si toutes les cases sont remplies et sans erreurs → victoire
    const allFilled = newGrid.flat().every(cell => cell.value);
    const noErrors = newGrid.flat().every(cell => !cell.error);
    if (allFilled && noErrors) alert('🎉 Victoire !') && navigate('/sudokuaccueil');
  };

  // 🔹 Quand le joueur tape un chiffre
  const handleChange = (r, c, val) => {
    // Empêche les caractères non numériques ou trop longs
    if (!/^\d{0,2}$/.test(val)) return;
    const newGrid = grid.map((row, i) =>
      row.map((cell, j) =>
        i === r && j === c && !cell.fixed ? { ...cell, value: val } : cell
      )
    );
    setGrid(newGrid);
    validateGrid();
  };

  // 🔹 Génère la grille au chargement de la page
  useEffect(() => {
    fillPresetRandomly();
  }, []);

  return (
    <div className="jeu">
      {/* 🔙 Bouton retour vers la page d’accueil du sudoku */}
      <a href="/sudokuaccueil" className="back-button">← Retour à l’accueil</a>

      <h2 id="title">Sudoku {blockGridSize}×{blockGridSize}</h2>
      <p id="legend" className="legend">
        Chaque ligne, colonne et bloc doit contenir les chiffres de 1 à {gridSize}.
      </p>

      {/* 🧩 Grille de Sudoku */}
      <div
        id="grid"
        style={{ display: 'grid', gridTemplateColumns: `repeat(${gridSize}, 40px)` }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`cell ${cell.fixed ? 'fixed' : ''} ${cell.error ? 'error' : ''}`}
              style={{
                borderTop: r % blockSize === 0 ? '3px solid #aaa' : '',
                borderLeft: c % blockSize === 0 ? '3px solid #aaa' : '',
                borderBottom: r === gridSize - 1 ? '3px solid #aaa' : '',
                borderRight: c === gridSize - 1 ? '3px solid #aaa' : ''
              }}
            >
              <input
                type="text"
                maxLength={2}
                value={cell.value}
                onChange={e => handleChange(r, c, e.target.value)}
              />
            </div>
          ))
        )}
      </div>

      {/* 🎨 Styles CSS */}
      <style>{`
        body { margin: 0; font-family: monospace; background: #111; color: white; text-align: center; }
        .jeu { padding: 30px; }
        #title { font-size: 2em; color: #0ff; text-shadow: 0 0 10px #0ff; }
        .legend { font-size: 1em; color: #ccc; margin-bottom: 20px; }
        #grid { display: grid; gap: 2px; margin: 20px auto; width: fit-content; padding: 10px; background: #222; border: 2px solid #555; border-radius: 8px; }
        .cell { width: 40px; height: 40px; background: #333; border: 1px solid #555; text-align: center; }
        .cell input { width: 100%; height: 100%; background: transparent; border: none; color: white; font-size: 1.2em; text-align: center; }
        .cell.fixed input { color: #0f0; } /* vert pour les valeurs fixes */
        .cell.error input { background-color: #800; } /* rouge si erreur */
        .back-button { margin: 20px; padding: 10px 20px; background: #333; color: white; text-decoration: none; border-radius: 6px; font-size: 1em; }
        .back-button:hover { background: #555; }
      `}</style>
    </div>
  );
}
