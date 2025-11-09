import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from "axios";

/*
  🔹 Composant principal de la page de jeu "Voiture"
  - Affiche le canvas de jeu
  - Permet de déplacer la voiture du joueur
  - Génère des obstacles ennemis
  - Gère le score et le Nitro
  - Détecte les collisions et termine la partie
*/
export default function Voiture() {
  const canvasRef = useRef(null); // Référence vers le canvas pour dessiner
  const [searchParams] = useSearchParams(); // Pour récupérer les paramètres de l'URL
  const navigate = useNavigate(); // Pour rediriger après le game over

  // 🔹 Voiture sélectionnée depuis la page d'accueil
  const selectedCar = searchParams.get('car') || 'images/car-red.png';

  // 🔹 Joueur : position et dimensions
  const player = {
    x: 180,
    y: 500,
    width: 40,
    height: 80,
    sprite: selectedCar
  };

  // 🔹 Images des voitures ennemies
  const enemyImages = [
    'voitureenemieimage/car1.png',
    'voitureenemieimage/car2.png',
    'voitureenemieimage/car3.png',
    'voitureenemieimage/car4.png'
  ];

  // 🔹 Variables de jeu
  let obstacles = [];           // Tableau pour stocker les obstacles
  let speed = 4;                // Vitesse des obstacles
  let survivalTime = 0;         // Temps survécu
  let isGameOver = false;       // Booléen pour game over
  let isNitroActive = false;    // Nitro activé ?
  let nitroLevel = 100;         // Niveau de Nitro
  let canUseNitro = true;       // Nitro disponible ?
  let gameLoop, obstacleLoop, speedLoop, nitroInterval; // Intervalles du jeu

  // --- Fonction pour dessiner une voiture sur le canvas ---
  function drawCar(ctx, obj) {
    const img = new Image();
    img.src = obj.sprite;
    img.onload = () => {
      ctx.drawImage(img, obj.x, obj.y, obj.width, obj.height);
    };
  }

  // 🔹 Choisir une image ennemie aléatoire
  function getRandomEnemyImage() {
    const index = Math.floor(Math.random() * enemyImages.length);
    return enemyImages[index];
  }

  // 🔹 Générer de nouveaux obstacles
  function spawnObstacle(ctx) {
    if (isGameOver) return;

    const count = Math.floor(Math.random() * 3) + 1; // 1 à 3 obstacles
    const minGap = 50; // Écart minimum entre obstacles
    const positions = [];

    while (positions.length < count) {
      const x = Math.floor(Math.random() * (ctx.canvas.width - 40));
      const tooClose = positions.some(px => Math.abs(px - x) < minGap);
      if (!tooClose) positions.push(x);
    }

    positions.forEach(x => {
      obstacles.push({
        x,
        y: -80,
        width: 40,
        height: 80,
        sprite: getRandomEnemyImage()
      });
    });
  }

  // 🔹 Gestion de collision et fin de partie
  function handleCollision() {
    isGameOver = true;

    // Stoppe toutes les boucles
    clearInterval(gameLoop);
    clearInterval(obstacleLoop);
    clearInterval(speedLoop);
    clearInterval(nitroInterval);

    // Affiche le panneau Game Over
    document.getElementById('gameOver').classList.remove('hidden');

    // Envoie le score au serveur
    const username = localStorage.getItem("playerName") || "Invité";
    axios.post("http://localhost:5000/scores", {
      username,
      game: "accueil",
      score: survivalTime
    }).then(() => {
      console.log("Score envoyé !");
    }).catch(err => console.error("Erreur lors de l'envoi du score :", err));

    // Retour à l'accueil après 1.5s
    setTimeout(() => {
      navigate('../accueil');
    }, 1500);
  }

  // 🔹 Mise à jour du jeu à chaque frame
  function update(ctx) {
    if (isGameOver) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Dessine le joueur
    drawCar(ctx, player);

    // 🔥 Positionne la flamme derrière la voiture si Nitro actif
    const flame = document.getElementById("flame");
    flame.style.left = `${player.x + player.width / 2 - 8}px`;
    flame.style.top = `${player.y + player.height}px`;

    // Déplace et dessine les obstacles
    obstacles.forEach((obs, i) => {
      obs.y += speed;
      drawCar(ctx, obs);

      // Vérifie collision
      if (
        obs.x < player.x + player.width &&
        obs.x + obs.width > player.x &&
        obs.y < player.y + player.height &&
        obs.y + obs.height > player.y
      ) {
        handleCollision();
      }

      // Supprime obstacle passé
      if (obs.y > ctx.canvas.height) obstacles.splice(i, 1);
    });
  }

  // 🔹 useEffect principal : initialise le jeu
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Boucle principale du jeu : update 60fps
    gameLoop = setInterval(() => update(ctx), 1000 / 60);

    // Boucle pour créer des obstacles
    obstacleLoop = setInterval(() => spawnObstacle(ctx), 1500);

    // Boucle pour le score et augmentation de vitesse
    speedLoop = setInterval(() => {
      if (!isGameOver) {
        survivalTime += 1;
        document.getElementById('scoreDisplay').textContent = `⏱ Temps : ${survivalTime}s`;
        if (survivalTime % 5 === 0) speed += 0.5;
      }
    }, 1000);

    // 🔋 Gestion du Nitro
    nitroInterval = setInterval(() => {
      const bar = document.getElementById('nitroBarFill');
      if (isNitroActive) {
        nitroLevel -= 2;
        if (nitroLevel <= 0) {
          nitroLevel = 0;
          isNitroActive = false;
          speed /= 2;
          document.getElementById("flame").classList.add("hidden");
          canUseNitro = false;

          // Recharge Nitro après 10s
          setTimeout(() => {
            nitroLevel = 100;
            canUseNitro = true;
          }, 10000);
        }
      } else if (!canUseNitro && nitroLevel < 100) {
        nitroLevel += 1; // Recharge partielle
      } else if (canUseNitro && nitroLevel < 100) {
        nitroLevel += 0.5; // Recharge normale
      }

      bar.style.height = `${nitroLevel}%`;
      bar.style.backgroundColor = nitroLevel > 30 ? '#00ffff' : '#ff0044';
    }, 100);

    // 🔹 Gestion des touches
    const handleKeyDown = (e) => {
      if (isGameOver) return;

      // Déplacement
      if (e.key === 'ArrowLeft' && player.x > 0) player.x -= 20;
      if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) player.x += 20;

      // Activation Nitro
      if ((e.key === 'e' || e.key === 'E') && canUseNitro && !isNitroActive && nitroLevel === 100) {
        isNitroActive = true;
        speed *= 2;
        document.getElementById("flame").classList.remove("hidden");
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup : stoppe toutes les boucles et listeners
    return () => {
      clearInterval(gameLoop);
      clearInterval(obstacleLoop);
      clearInterval(speedLoop);
      clearInterval(nitroInterval);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 🔹 Style global du body
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.backgroundColor = '#000';
    document.body.style.fontFamily = "'Press Start 2P', cursive, sans-serif";
    document.body.style.overflow = 'hidden';
    document.body.style.display = 'flex';
    document.body.style.flexDirection = 'column';
    document.body.style.alignItems = 'center';
    document.body.style.justifyContent = 'center';
    document.body.style.height = '100vh';
    document.body.style.position = 'relative';

    // Cleanup
    return () => {
      document.body.style = '';
    };
  }, []);

  return (
    <>
      {/* 🔹 Styles internes */}
      <style>{`
        canvas {
          background-color: #222;
          border: 4px solid #0ff;
          border-radius: 10px;
          box-shadow: 0 0 20px #0ff;
          margin-bottom: 60px;
        }

        #scoreDisplay {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: #00ffff;
          font-size: 20px;
          font-family: 'Press Start 2P', cursive;
          background: #000;
          padding: 10px 20px;
          border: 2px solid #00ffff;
          border-radius: 10px;
          box-shadow: 0 0 10px #00ffff;
          z-index: 5;
        }

        #gameOver {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #000;
          color: #0c00f6;
          padding: 30px 50px;
          border: 4px solid #0c00f6;
          border-radius: 12px;
          font-size: 20px;
          text-align: center;
          z-index: 10;
          box-shadow: 0 0 20px #0c00f6, 0 0 40px #0c00f6;
          animation: blink 0.8s infinite;
        }

        #flame {
          position: absolute;
          width: 16px;
          height: 40px;
          background: linear-gradient(to bottom, cyan, blue, red, orange);
          border-radius: 8px;
          box-shadow: 0 0 25px cyan, 0 0 40px blue;
          animation: flameMove 0.1s infinite alternate;
          z-index: 4;
        }

        @keyframes flameMove {
          from { transform: scaleY(1); opacity: 0.9; }
          to { transform: scaleY(1.3); opacity: 0.6; }
        }

        #nitroBar {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 15px;
          height: 200px;
          border: 2px solid #00ffff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 0 15px #00ffff;
          background: #000;
        }

        #nitroBarFill {
          width: 100%;
          height: 100%;
          background-color: #00ffff;
          transition: height 0.2s ease-in-out;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .hidden { display: none; }
      `}</style>

      <div className="voiture-container">
        {/* 🔹 Canvas du jeu */}
        <canvas ref={canvasRef} width={400} height={600} />

        {/* 🔹 Score */}
        <div id="scoreDisplay">⏱ Temps : 0s</div>

        {/* 🔹 Game Over */}
        <div id="gameOver" className="hidden">💥 Collision ! Game Over</div>

        {/* 🔹 Flamme Nitro */}
        <div id="flame" className="hidden"></div>

        {/* 🔹 Barre de Nitro */}
        <div id="nitroBar">
          <div id="nitroBarFill"></div>
        </div>
      </div>
    </>
  );
}
