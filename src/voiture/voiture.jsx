import React, { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function Voiture() {
  const canvasRef = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedCar = searchParams.get('car') || 'images/car-red.png';

  const player = {
    x: 180,
    y: 500,
    width: 40,
    height: 80,
    sprite: selectedCar
  };

  const enemyImages = [
    'voitureenemieimage/car1.png',
    'voitureenemieimage/car2.png',
    'voitureenemieimage/car3.png',
    'voitureenemieimage/car4.png'
  ];

  let obstacles = [];
  let speed = 4;
  let survivalTime = 0;
  let isGameOver = false;
  let gameLoop, obstacleLoop, speedLoop;

  function drawCar(ctx, obj) {
    const img = new Image();
    img.src = obj.sprite;
    img.onload = () => {
      ctx.drawImage(img, obj.x, obj.y, obj.width, obj.height);
    };
  }

  function getRandomEnemyImage() {
    const index = Math.floor(Math.random() * enemyImages.length);
    return enemyImages[index];
  }

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

  function handleCollision() {
    isGameOver = true;
    clearInterval(gameLoop);
    clearInterval(obstacleLoop);
    clearInterval(speedLoop);
    document.getElementById('gameOver').classList.remove('hidden');

    setTimeout(() => {
      navigate('accueil');
    }, 1500);
  }

  function update(ctx) {
    if (isGameOver) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawCar(ctx, player);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    gameLoop = setInterval(() => update(ctx), 1000 / 60);
    obstacleLoop = setInterval(() => spawnObstacle(ctx), 1500);
    speedLoop = setInterval(() => {
      if (!isGameOver) {
        survivalTime += 1;
        document.getElementById('scoreDisplay').textContent = `⏱ Temps : ${survivalTime}s`;
        if (survivalTime % 5 === 0) speed += 0.5;
      }
    }, 1000);

    const handleKeyDown = (e) => {
      if (isGameOver) return;
      if (e.key === 'ArrowLeft' && player.x > 0) player.x -= 20;
      if (e.key === 'ArrowRight' && player.x < canvas.width - player.width) player.x += 20;
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(gameLoop);
      clearInterval(obstacleLoop);
      clearInterval(speedLoop);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 🔧 Appliquer le style global au body
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
  }, []);

  return (
    <>
      {/* 🔸 Style intégré */}
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
          font-family: 'Press Start 2P', cursive, sans-serif;
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

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .hidden {
          display: none;
        }

        #carToggle {
          background-color: #000;
          color: #0ff;
          border: 2px solid #0ff;
          padding: 10px 20px;
          margin: 10px auto;
          font-family: 'Press Start 2P', cursive;
          text-align: center;
          width: fit-content;
          box-shadow: 0 0 10px #0ff;
          cursor: pointer;
        }

        #carSelector {
          margin-top: 10px;
          text-align: center;
          font-family: 'Press Start 2P', cursive;
          color: #0ff;
        }

        #carChoice {
          background-color: #111;
          color: #0ff;
          border: 2px solid #0ff;
          padding: 8px;
          font-size: 14px;
          margin-top: 10px;
          font-family: 'Press Start 2P', cursive;
        }
      `}</style>

      <div className="voiture-container">
        <canvas ref={canvasRef} width={400} height={600} />
        <div id="scoreDisplay">⏱ Temps : 0s</div>
        <div id="gameOver" className="hidden">💥 Collision ! Game Over</div>
      </div>
    </>
  );
}
