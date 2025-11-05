import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ArrowRush() {
  const [searchParams] = useSearchParams();
  const difficulty = searchParams.get('difficulty') || 'simple';

  const gameAreaRef = useRef(null);
  const [score, setScore] = useState(0);

  const settings = {
    simple: { speed: 2, interval: 1500 },
    difficile: { speed: 4, interval: 1000 },
    hardcore: { speed: 6, interval: 600 }
  };

  const { speed, interval } = settings[difficulty] || settings.simple;

  const spawnArrow = () => {
    const directions = ['left', 'down', 'up', 'right'];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    const column = gameAreaRef.current.querySelector(`.column[data-direction="${dir}"]`);
    const arrow = document.createElement('div');
    arrow.classList.add('arrow', dir);
    arrow.style.top = '0px';
    arrow.dataset.direction = dir;
    arrow.style.left = `${(column.offsetWidth - 60) / 2}px`;
    column.appendChild(arrow);
  };

  const moveArrows = () => {
    const arrows = gameAreaRef.current.querySelectorAll('.arrow');
    arrows.forEach((arrow) => {
      let top = parseInt(arrow.style.top);
      top += speed;
      arrow.style.top = `${top}px`;

      if (top > 500 && !arrow.dataset.hit) {
        arrow.dataset.hit = true;
        setScore((prev) => prev - 5);
        arrow.remove();
      }
    });
  };

  const checkHit = (key) => {
    const lineY = gameAreaRef.current.offsetHeight - 100;
    const arrows = gameAreaRef.current.querySelectorAll('.arrow');
    arrows.forEach((arrow) => {
      const top = parseInt(arrow.style.top);
      const arrowHeight = arrow.offsetHeight;
      const arrowBottom = top + arrowHeight;
      const isTouchingLine = lineY >= top && lineY <= arrowBottom;

      if (
        isTouchingLine &&
        arrow.dataset.direction === key &&
        !arrow.dataset.hit
      ) {
        arrow.dataset.hit = true;
        setScore((prev) => prev + 10);
        arrow.remove();
      }
    });
  };

  useEffect(() => {
    const spawnInterval = setInterval(spawnArrow, interval);
    const moveInterval = setInterval(moveArrows, 30);

    const handleKeyDown = (e) => {
      const map = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right'
      };
      if (map[e.key]) checkHit(map[e.key]);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [interval, speed]);

  // 🔧 Style global du body
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.fontFamily = "'Courier New', monospace";
    document.body.style.backgroundColor = '#111';
    document.body.style.color = 'white';
    document.body.style.textAlign = 'center';
  }, []);

  return (
    <>
      <style>{`
        .jeu #game-area {
          position: relative;
          width: 600px;
          height: 600px;
          margin: 40px auto;
          background: #222;
          display: flex;
          justify-content: space-between;
          overflow: hidden;
          border: 3px solid #555;
          box-shadow: 0 0 20px #000;
        }

        .column {
          position: relative;
          width: 140px;
          height: 100%;
          overflow: visible;
          border-left: 1px solid #333;
          border-right: 1px solid #333;
        }

        #line {
          position: absolute;
          bottom: 100px;
          left: 0;
          width: 100%;
          height: 5px;
          background: red;
        }

        .arrow {
          position: absolute;
          width: 60px;
          height: 60px;
          background-size: cover;
        }

        .arrow.up    { background-image: url('arrowrushimage/flechebleuhaut.png'); }
        .arrow.down  { background-image: url('arrowrushimage/flechebleubas.png'); }
        .arrow.left  { background-image: url('arrowrushimage/flechebleugauche.png'); }
        .arrow.right { background-image: url('arrowrushimage/flechebleudroite.png'); }

        #score {
          font-size: 24px;
          margin-top: 20px;
          color: #0ff;
        }
      `}</style>

      <div className="jeu">
        <div id="score">Score : {score}</div>
        <div id="game-area" ref={gameAreaRef}>
          <div className="column" data-direction="left"></div>
          <div className="column" data-direction="down"></div>
          <div className="column" data-direction="up"></div>
          <div className="column" data-direction="right"></div>
          <div id="line"></div>
        </div>
      </div>
    </>
  );
}
