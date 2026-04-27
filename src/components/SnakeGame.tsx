import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play, Square } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 100;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Don't place food on snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    setFood(newFood);
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
    generateFood();
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setIsGameOver(true);
      return;
    }

    // Self collision
    if (snake.some((segment) => segment.x === head.x && segment.y === head.y)) {
      setIsGameOver(true);
      return;
    }

    const newSnake = [head, ...snake];

    // Food collision
    if (head.x === food.x && head.y === food.y) {
      setScore(s => {
        const next = s + 10;
        if (next > highScore) setHighScore(next);
        return next;
      });
      generateFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, direction, food, isGameOver, isPaused, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const tick = useCallback((timestamp: number) => {
    if (!lastUpdateRef.current) lastUpdateRef.current = timestamp;
    const progress = timestamp - lastUpdateRef.current;

    if (progress > SPEED) {
      moveSnake();
      lastUpdateRef.current = timestamp;
    }
    gameLoopRef.current = requestAnimationFrame(tick);
  }, [moveSnake]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(tick);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [tick]);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Game Header */}
      <div className="w-full max-w-[400px] flex justify-between items-center bg-dark-card/50 p-4 rounded-xl border border-white/5 backdrop-blur-sm shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-mono">Current Score</span>
          <span className="text-2xl font-display font-bold neon-text-cyan">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2 text-gray-500">
            <Trophy size={14} className="text-neon-pink" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono">High Score</span>
          </div>
          <span className="text-xl font-display font-bold text-white/90">{highScore}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative group">
        <div 
          className="grid gap-[1px] bg-white/5 border-2 border-neon-cyan/20 rounded-lg overflow-hidden neon-glow-cyan"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(90vw, 400px)',
            height: 'min(90vw, 400px)'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = snake.slice(1).some(s => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`w-full h-full relative ${
                  isSnakeHead ? 'bg-neon-cyan shadow-[0_0_8px_rgba(0,243,255,1)] z-10' : 
                  isSnakeBody ? 'bg-neon-cyan/40 scale-95' : 
                  isFood ? 'bg-neon-pink shadow-[0_0_12px_rgba(255,0,255,1)] rounded-full animate-pulse z-10' : 
                  'bg-white/[0.02]'
                }`}
              >
                {isSnakeHead && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1/2 h-1/2 bg-dark-bg rounded-full opacity-50" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Game Over / Pause Overlays */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex flex-center bg-dark-bg/80 backdrop-blur-md rounded-lg overflow-hidden"
            >
              <div className="flex flex-col items-center gap-6 p-8 text-center m-auto">
                {isGameOver ? (
                  <>
                    <motion.h2 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-4xl font-display font-black tracking-tight neon-text-pink"
                    >
                      GAME OVER
                    </motion.h2>
                    <p className="text-gray-400 font-mono text-xs uppercase tracking-widest">
                      Final Score: {score}
                    </p>
                    <button 
                      onClick={resetGame}
                      className="group relative flex items-center gap-3 px-8 py-3 bg-neon-cyan text-dark-bg font-bold rounded-full hover:scale-105 transition-transform"
                    >
                      <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                      RESTART
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl font-display font-black tracking-tight text-white/90">PAUSED</h2>
                    <p className="text-gray-500 font-mono text-xs uppercase tracking-widest max-w-[200px]">
                      Press Space or click below to resume your rhythm
                    </p>
                    <button 
                      onClick={() => setIsPaused(false)}
                      className="group flex items-center justify-center w-20 h-20 bg-neon-cyan/10 border-2 border-neon-cyan rounded-full hover:bg-neon-cyan hover:text-dark-bg transition-all duration-300"
                    >
                      <Play size={32} fill="currentColor" />
                    </button>
                    {score > 0 && (
                       <button 
                       onClick={resetGame}
                       className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors"
                     >
                       <Square size={14} />
                       <span className="text-[10px] uppercase font-mono tracking-widest">End Session</span>
                     </button>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Help */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-[400px]">
        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
          <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">Movement</span>
          <div className="flex gap-1">
            {['↑', '←', '↓', '→'].map(k => (
              <span key={k} className="w-6 h-6 flex items-center justify-center bg-white/10 rounded text-xs font-mono">{k}</span>
            ))}
          </div>
        </div>
        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
          <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-2">Pause / Play</span>
          <span className="px-3 py-1 bg-white/10 rounded text-[10px] font-mono uppercase tracking-widest">Spacebar</span>
        </div>
      </div>
    </div>
  );
}
