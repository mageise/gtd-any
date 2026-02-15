import { useEffect, useRef, useState, useCallback } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const COLS = 10;
const ROWS = 20;
const CELL_SIZE = 18;
const GAME_DURATION = 300;

const TETROMINOES = {
  I: { shape: [[1, 1, 1, 1]], color: '#3b82f6' },
  O: { shape: [[1, 1], [1, 1]], color: '#eab308' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: '#a855f7' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: '#22c55e' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: '#ef4444' },
  J: { shape: [[1, 0, 0], [1, 1, 1]], color: '#f97316' },
  L: { shape: [[0, 0, 1], [1, 1, 1]], color: '#06b6d4' },
};

type TetrominoKey = keyof typeof TETROMINOES;

interface Tetromino {
  shape: number[][];
  color: string;
  x: number;
  y: number;
}

function createTetromino(): Tetromino {
  const keys = Object.keys(TETROMINOES) as TetrominoKey[];
  const key = keys[Math.floor(Math.random() * keys.length)];
  const tet = TETROMINOES[key];
  return {
    shape: tet.shape,
    color: tet.color,
    x: Math.floor((COLS - tet.shape[0].length) / 2),
    y: 0,
  };
}

function rotateMatrix(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated: number[][] = [];
  for (let c = 0; c < cols; c++) {
    rotated[c] = [];
    for (let r = 0; r < rows; r++) {
      rotated[c][r] = matrix[rows - 1 - r][c];
    }
  }
  return rotated;
}

export function Tetris() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastDropRef = useRef<number>(0);
  
  const [highScore, setHighScore] = useLocalStorage<number>('daily-dashboard-tetris-highscore', 0);
  
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [level, setLevel] = useState(1);
  
  const boardRef = useRef<(number | string)[][]>([]);
  const currentRef = useRef<Tetromino | null>(null);
  const timeLeftRef = useRef(GAME_DURATION);
  
  const initBoard = useCallback(() => {
    const board: (number | string)[][] = [];
    for (let r = 0; r < ROWS; r++) {
      board[r] = [];
      for (let c = 0; c < COLS; c++) {
        board[r][c] = 0;
      }
    }
    return board;
  }, []);
  
  const draw = useCallback((board: (number | string)[][], current: Tetromino | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = '#1e1e2e';
    ctx.fillRect(0, 0, COLS * CELL_SIZE, ROWS * CELL_SIZE);
    
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = board[r][c];
        if (cell && typeof cell === 'string') {
          ctx.fillStyle = cell;
          ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
          ctx.strokeStyle = '#2a2a3e';
          ctx.strokeRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
        }
      }
    }
    
    if (current) {
      ctx.fillStyle = current.color;
      for (let r = 0; r < current.shape.length; r++) {
        for (let c = 0; c < current.shape[r].length; c++) {
          if (current.shape[r][c]) {
            const drawX = (current.x + c) * CELL_SIZE;
            const drawY = (current.y + r) * CELL_SIZE;
            ctx.fillRect(drawX, drawY, CELL_SIZE - 1, CELL_SIZE - 1);
            ctx.strokeStyle = '#2a2a3e';
            ctx.strokeRect(drawX, drawY, CELL_SIZE - 1, CELL_SIZE - 1);
          }
        }
      }
    }
  }, []);
  
  const isValid = useCallback((board: (number | string)[][], piece: Tetromino): boolean => {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const newX = piece.x + c;
          const newY = piece.y + r;
          if (newX < 0 || newX >= COLS || newY >= ROWS) return false;
          if (newY >= 0 && board[newY][newX]) return false;
        }
      }
    }
    return true;
  }, []);
  
  const clearLines = useCallback((board: (number | string)[][]): number => {
    let cleared = 0;
    
    const rowsToKeep: (number | string)[][] = [];
    
    for (let r = 0; r < ROWS; r++) {
      const isComplete = board[r].every(cell => Boolean(cell));
      if (!isComplete) {
        rowsToKeep.push([...board[r]]);
      } else {
        cleared++;
      }
    }
    
    while (rowsToKeep.length < ROWS) {
      rowsToKeep.unshift(Array(COLS).fill(0));
    }
    
    for (let r = 0; r < ROWS; r++) {
      board[r] = rowsToKeep[r];
    }
    
    return cleared;
  }, []);
  
  const spawnPiece = useCallback((): Tetromino => {
    return createTetromino();
  }, []);
  
  const mergePiece = useCallback((board: (number | string)[][], piece: Tetromino) => {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const newY = piece.y + r;
          const newX = piece.x + c;
          if (newY >= 0) {
            board[newY][newX] = piece.color;
          }
        }
      }
    }
  }, []);
  
  const gameOver = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    setGameState('gameover');
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore, setHighScore]);

  const giveUp = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    setGameState('gameover');
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore, setHighScore]);

  const updateRef = useRef<((timestamp: number) => void) | null>(null);
  
  const update = useCallback((timestamp: number) => {
    if (gameState !== 'playing') return;
    
    if (timestamp - lastDropRef.current > Math.max(100, 1000 - (level - 1) * 100)) {
      lastDropRef.current = timestamp;
      
      const current = currentRef.current;
      const board = boardRef.current;
      
      if (!current) {
        currentRef.current = spawnPiece();
        if (!isValid(board, currentRef.current)) {
          gameOver();
          return;
        }
        draw(board, currentRef.current);
        return;
      }
      
      const moved = { ...current, y: current.y + 1 };
      if (isValid(board, moved)) {
        currentRef.current = moved;
      } else {
        mergePiece(board, current);
        const cleared = clearLines(board);
        if (cleared > 0) {
          setLines(prev => {
            const newLines = prev + cleared;
            setScore(prev => prev + cleared * 100 * (cleared > 1 ? cleared : 1));
            const newLevel = Math.floor(newLines / 10) + 1;
            setLevel(newLevel);
            return newLines;
          });
        }
        
        currentRef.current = spawnPiece();
        if (!isValid(board, currentRef.current)) {
          gameOver();
          return;
        }
      }
      
      draw(board, currentRef.current);
    }
    
    if (updateRef.current) {
      gameLoopRef.current = requestAnimationFrame(updateRef.current);
    }
  }, [gameState, level, spawnPiece, isValid, mergePiece, clearLines, draw, gameOver]);
  
  useEffect(() => {
    updateRef.current = update;
  }, [update]);
  
  useEffect(() => {
    if (gameState === 'playing') {
      boardRef.current = initBoard();
      currentRef.current = spawnPiece();
      lastDropRef.current = 0;
      timeLeftRef.current = GAME_DURATION;
      draw(boardRef.current, currentRef.current);
      gameLoopRef.current = requestAnimationFrame(update);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState, initBoard, spawnPiece, draw]);
  
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const timer = setInterval(() => {
      timeLeftRef.current -= 1;
      setTimeLeft(timeLeftRef.current);
      
      if (timeLeftRef.current <= 0) {
        gameOver();
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState, gameOver]);
  
  const movePiece = useCallback((direction: 'left' | 'right' | 'down') => {
    const current = currentRef.current;
    const board = boardRef.current;
    if (!current) return;
    
    if (direction === 'down') {
      const moved = { ...current, y: current.y + 1 };
      if (isValid(board, moved)) {
        currentRef.current = moved;
        draw(board, currentRef.current);
      }
    } else if (direction === 'left') {
      const moved = { ...current, x: current.x - 1 };
      if (isValid(board, moved)) {
        currentRef.current = moved;
        draw(board, currentRef.current);
      }
    } else if (direction === 'right') {
      const moved = { ...current, x: current.x + 1 };
      if (isValid(board, moved)) {
        currentRef.current = moved;
        draw(board, currentRef.current);
      }
    }
  }, [isValid, draw]);
  
  const rotatePiece = useCallback(() => {
    const current = currentRef.current;
    const board = boardRef.current;
    if (!current) return;
    
    const rotated = { ...current, shape: rotateMatrix(current.shape) };
    if (isValid(board, rotated)) {
      currentRef.current = rotated;
      draw(board, currentRef.current);
    }
  }, [isValid, draw]);
  
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        movePiece('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        movePiece('right');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        movePiece('down');
      } else if (e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault();
        rotatePiece();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, movePiece, rotatePiece]);
  
  const longPressTimerRef = useRef<number | null>(null);
  const lastPointerXRef = useRef<number>(0);
  const isLongPressRef = useRef(false);
  
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.setPointerCapture(e.pointerId);
    
    const rect = canvas.getBoundingClientRect();
    lastPointerXRef.current = e.clientX - rect.left;
    const width = rect.width;
    const x = lastPointerXRef.current;
    
    if (x >= width / 3 && x <= (width * 2) / 3) {
      isLongPressRef.current = false;
      longPressTimerRef.current = window.setTimeout(() => {
        isLongPressRef.current = true;
        movePiece('down');
      }, 400);
    }
  }, [gameState, movePiece]);
  
  const handlePointerUp = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.releasePointerCapture(e.pointerId);
    
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    if (isLongPressRef.current) {
      isLongPressRef.current = false;
      return;
    }
    
    if (gameState !== 'playing') return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    
    const current = currentRef.current;
    const board = boardRef.current;
    
    if (!current) return;
    
    if (x < width / 3) {
      const moved = { ...current, x: current.x - 1 };
      if (isValid(board, moved)) {
        currentRef.current = moved;
        draw(board, currentRef.current);
      }
    } else if (x > (width * 2) / 3) {
      const moved = { ...current, x: current.x + 1 };
      if (isValid(board, moved)) {
        currentRef.current = moved;
        draw(board, currentRef.current);
      }
    } else {
      const rotated = { ...current, shape: rotateMatrix(current.shape) };
      if (isValid(board, rotated)) {
        currentRef.current = rotated;
        draw(board, currentRef.current);
      }
    }
  }, [gameState, isValid, draw]);
  
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };
  
  const footer = (
    <>
      {gameState === 'playing' && (
        <span className="flex justify-between w-full">
          <span>Score: {score} | L{level}</span>
          <span className={timeLeft <= 30 ? 'text-rose-500' : ''}>{formatTime(timeLeft)}</span>
        </span>
      )}
      {gameState === 'idle' && <span>Best: {highScore}</span>}
      {gameState === 'gameover' && (
        <span className="flex justify-between w-full">
          <span>Game Over! Score: {score}</span>
          {score >= highScore && score > 0 && <span className="text-emerald-500">New Best!</span>}
        </span>
      )}
    </>
  );
  
  return (
    <WidgetContainer title="Tetris" footer={footer}>
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={COLS * CELL_SIZE}
            height={ROWS * CELL_SIZE}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            className="rounded-lg cursor-pointer touch-manipulation max-w-full"
            style={{ maxHeight: '60vh' }}
          />
        </div>
        
        {gameState === 'playing' && (
          <div className="flex justify-between w-full" style={{ width: COLS * CELL_SIZE }}>
            <span className="text-xs text-[var(--color-text-secondary)]">Lines: {lines}</span>
            <button
              onClick={giveUp}
              className="text-xs text-[var(--color-text-secondary)] hover:text-rose-500"
            >
              Give Up
            </button>
          </div>
        )}
        
        {gameState === 'idle' && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-[var(--color-text-secondary)] text-center">
              Desktop: Arrow keys ← → ↑ ↓<br />
              Mobile: Tap ← → | center rotate | hold drop<br />
              5 min limit
            </p>
            <button
              onClick={() => { setScore(0); setLines(0); setLevel(1); setTimeLeft(GAME_DURATION); setGameState('playing'); }}
              className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
            >
              Start Game
            </button>
            {highScore > 0 && (
              <p className="text-xs text-[var(--color-text-secondary)]">High Score: {highScore}</p>
            )}
          </div>
        )}
        
        {gameState === 'gameover' && (
          <button
            onClick={() => setGameState('playing')}
            className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            Play Again
          </button>
        )}
      </div>
    </WidgetContainer>
  );
}
