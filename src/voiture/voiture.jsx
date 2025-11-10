import React, { useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Voiture() {
  const canvasRef = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedCar = searchParams.get("car") || "images/car-red.png";

  // 🔹 Joueur
  const player = {
    x: 180,
    y: 500,
    width: 40,
    height: 80,
    sprite: selectedCar
  };

  // 🔹 Voitures ennemies
  const enemyImages = [
    "voitureenemieimage/car1.png",
    "voitureenemieimage/car2.png",
    "voitureenemieimage/car3.png",
    "voitureenemieimage/car4.png"
  ];

  // 🔹 Variables du jeu
  let obstacles = [];
  let speed = 4;
  let survivalTime = 0;
  let isGameOver = false;

  // 🔥 Gestion du nitro
  let nitro = 100; // pourcentage (0 à 100)
  let isNitroActive = false;
  let canUseNitro = true; // 🚫 empêche de relancer avant 100%
  let gameLoop, obstacleLoop, speedLoop, nitroLoop;

  // 🏎️ Dessin des voitures
  function drawCar(ctx, obj) {
    const img = new Image();
    img.src = obj.sprite;
    ctx.drawImage(img, obj.x, obj.y, obj.width, obj.height);
  }

  // 🔹 Choix d'une voiture ennemie
  function getRandomEnemyImage() {
    const index = Math.floor(Math.random() * enemyImages.length);
    return enemyImages[index];
  }

  // 🚧 Création des obstacles
  function spawnObstacle(ctx) {
    if (isGameOver) return;

    const count = Math.floor(Math.random() * 3) + 1;
    const minGap = 50;
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

  // 💥 Collision
  function handleCollision() {
    isGameOver = true;
    clearInterval(gameLoop);
    clearInterval(obstacleLoop);
    clearInterval(speedLoop);
    clearInterval(nitroLoop);
    document.getElementById("gameOver").classList.remove("hidden");

    // 🔹 Envoi du score
    const username = localStorage.getItem("playerName") || "Invité";
    axios
      .post("http://localhost:5000/scores", {
        username,
        game: "accueil",
        score: survivalTime
      })
      .then(() => console.log("✅ Score envoyé"))
      .catch(err => console.error("❌ Erreur :", err));

    setTimeout(() => {
      navigate("../accueil");
    }, 1500);
  }

  // 🔄 Mise à jour du jeu
  function update(ctx) {
    if (isGameOver) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawCar(ctx, player);

    // 🔥 Effet du nitro (flammes derrière la voiture)
    if (isNitroActive) {
      ctx.fillStyle = "orange";
      ctx.beginPath();
      ctx.moveTo(player.x + 10, player.y + player.height);
      ctx.lineTo(player.x + player.width / 2, player.y + player.height + 30);
      ctx.lineTo(player.x + player.width - 10, player.y + player.height);
      ctx.closePath();
      ctx.fill();
    }

    // 🧱 Obstacles
    obstacles.forEach((obs, i) => {
      obs.y += speed;
      drawCar(ctx, obs);

      if (
        obs.x < player.x + player.width &&
        obs.x + obs.width > player.x &&
        obs.y < player.y + player.height &&
        obs.y + obs.height > player.y
      ) {
        handleCollision();
      }

      if (obs.y > ctx.canvas.height) obstacles.splice(i, 1);
    });
  }

  // ⚙️ Mise à jour de la barre de nitro
  function updateNitroBar() {
    const bar = document.getElementById("nitroBar");
    if (bar) {
      const percent = Math.max(0, Math.min(100, nitro));
      bar.style.transform = `scaleY(${percent / 100})`;
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // 🔁 Boucles du jeu
    gameLoop = setInterval(() => update(ctx), 1000 / 60);
    obstacleLoop = setInterval(() => spawnObstacle(ctx), 1500);

    // ⏱️ Timer du jeu
    speedLoop = setInterval(() => {
      if (!isGameOver) {
        survivalTime += 1;
        document.getElementById("scoreDisplay").textContent = `⏱ Temps : ${survivalTime}s`;
        if (survivalTime % 5 === 0) speed += 0.5;
      }
    }, 1000);

    // ⛽ Gestion du nitro (vidage + recharge)
    nitroLoop = setInterval(() => {
      if (isNitroActive) {
        nitro -= 2; // consomme vite
        if (nitro <= 0) {
          nitro = 0;
          isNitroActive = false;
          canUseNitro = false; // 🚫 impossible de réactiver
          speed /= 2; // retour normal
        }
      } else if (!isNitroActive && nitro < 100) {
        nitro += 1; // recharge lente
        if (nitro >= 100) {
          nitro = 100;
          canUseNitro = true; // ✅ peut à nouveau l’utiliser
        }
      }
      updateNitroBar();
    }, 100);

    // 🎮 Contrôles clavier
    const handleKeyDown = e => {
      if (isGameOver) return;
      if (e.key === "ArrowLeft" && player.x > 0) player.x -= 20;
      if (e.key === "ArrowRight" && player.x < canvas.width - player.width)
        player.x += 20;

      // ⚡ Nitro activé avec E, seulement s’il est disponible
      if (e.key.toLowerCase() === "e" && canUseNitro && nitro === 100 && !isNitroActive) {
        isNitroActive = true;
        speed *= 2; // double la vitesse
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // 🧹 Nettoyage
    return () => {
      clearInterval(gameLoop);
      clearInterval(obstacleLoop);
      clearInterval(speedLoop);
      clearInterval(nitroLoop);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style = "";
    };
  }, []);

  // 🌈 Style global
  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.backgroundColor = "#000";
    document.body.style.fontFamily = "'Press Start 2P', cursive, sans-serif";
    document.body.style.overflow = "hidden";
    document.body.style.display = "flex";
    document.body.style.flexDirection = "column";
    document.body.style.alignItems = "center";
    document.body.style.justifyContent = "center";
    document.body.style.height = "100vh";
    document.body.style.position = "relative";

    return () => {
      document.body.style = "";
    };
  }, []);

  return (
    <>
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
          background: #000;
          padding: 10px 20px;
          border: 2px solid #00ffff;
          border-radius: 10px;
          box-shadow: 0 0 10px #00ffff;
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
          box-shadow: 0 0 20px #0c00f6, 0 0 40px #0c00f6;
          animation: blink 0.8s infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .hidden {
          display: none;
        }

        /* 🚀 Nitro réaliste */
        #nitroContainer {
          position: absolute;
          left: calc(50% + 230px);
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 250px;
          background: radial-gradient(circle at center, #222 0%, #111 100%);
          border: 3px solid #00ffff;
          border-radius: 20px;
          box-shadow: 0 0 15px #00ffff;
          overflow: hidden;
        }

        #nitroBar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, #ff0000 0%, #ff6600 50%, #ffff00 100%);
          border-radius: 0 0 20px 20px;
          transform-origin: bottom;
          transform: scaleY(1);
          transition: transform 0.2s linear;
        }

        #nitroText {
          position: absolute;
          top: -30px;
          width: 100%;
          text-align: center;
          color: #00ffff;
          font-size: 10px;
          font-family: 'Press Start 2P';
          text-shadow: 0 0 5px #00ffff;
        }
      `}</style>

      <div className="voiture-container">
        <canvas ref={canvasRef} width={400} height={600} />
        <div id="scoreDisplay">⏱ Temps : 0s</div>
        <div id="gameOver" className="hidden">💥 Collision ! Game Over</div>

        {/* 🔹 Barre de nitro */}
        <div id="nitroContainer">
          <div id="nitroText">NITRO</div>
          <div id="nitroBar"></div>
        </div>
      </div>
    </>
  );
}
