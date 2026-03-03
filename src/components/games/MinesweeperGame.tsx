import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bomb, Flag, RefreshCw, Smile } from 'lucide-react';

const GRID_SIZE = 8;
const NUM_MINES = 10;

type Cell = {
  id: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

export function MinesweeperGame() {
  const [grid, setGrid] = useState<Cell[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    // Initialize grid
    let newGrid: Cell[] = Array(GRID_SIZE * GRID_SIZE).fill(null).map((_, i) => ({
      id: i,
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0
    }));

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < NUM_MINES) {
      const idx = Math.floor(Math.random() * newGrid.length);
      if (!newGrid[idx].isMine) {
        newGrid[idx].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbors
    newGrid = newGrid.map((cell, idx) => {
      if (cell.isMine) return cell;
      
      const row = Math.floor(idx / GRID_SIZE);
      const col = idx % GRID_SIZE;
      let neighbors = 0;

      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
            const neighborIdx = r * GRID_SIZE + c;
            if (newGrid[neighborIdx].isMine) neighbors++;
          }
        }
      }
      return { ...cell, neighborMines: neighbors };
    });

    setGrid(newGrid);
    setGameOver(false);
    setWin(false);
    setScore(0);
  };

  const handleCellClick = (idx: number) => {
    if (gameOver || win || grid[idx].isFlagged || grid[idx].isRevealed) return;

    const newGrid = [...grid];
    const cell = newGrid[idx];

    if (cell.isMine) {
      // Game Over
      cell.isRevealed = true;
      setGrid(newGrid);
      setGameOver(true);
      // Reveal all mines
      setGrid(g => g.map(c => c.isMine ? { ...c, isRevealed: true } : c));
      return;
    }

    // Reveal cell
    const reveal = (index: number) => {
      if (newGrid[index].isRevealed || newGrid[index].isFlagged) return;
      
      newGrid[index].isRevealed = true;
      setScore(s => s + 10);

      if (newGrid[index].neighborMines === 0) {
        // Flood fill
        const row = Math.floor(index / GRID_SIZE);
        const col = index % GRID_SIZE;
        
        for (let r = row - 1; r <= row + 1; r++) {
          for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
              reveal(r * GRID_SIZE + c);
            }
          }
        }
      }
    };

    reveal(idx);
    setGrid(newGrid);

    // Check win
    const unrevealedSafeCells = newGrid.filter(c => !c.isMine && !c.isRevealed).length;
    if (unrevealedSafeCells === 0) {
      setWin(true);
      setScore(s => s + 500); // Win bonus
    }
  };

  const handleContextMenu = (e: React.MouseEvent, idx: number) => {
    e.preventDefault();
    if (gameOver || win || grid[idx].isRevealed) return;

    const newGrid = [...grid];
    newGrid[idx].isFlagged = !newGrid[idx].isFlagged;
    setGrid(newGrid);
  };

  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex justify-between w-full mb-4 px-2">
        <div className="bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-700 text-white font-mono font-bold">
          Score: {score}
        </div>
        <button 
          onClick={startNewGame}
          className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-white" />
        </button>
      </div>

      <div 
        className="grid gap-1 bg-slate-800 p-2 rounded-xl border-4 border-slate-700 shadow-2xl"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
      >
        {grid.map((cell, idx) => (
          <motion.button
            key={cell.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleCellClick(idx)}
            onContextMenu={(e) => handleContextMenu(e, idx)}
            className={`
              w-10 h-10 sm:w-12 sm:h-12 rounded-md font-bold text-lg flex items-center justify-center select-none transition-colors
              ${cell.isRevealed 
                ? (cell.isMine ? 'bg-red-500' : 'bg-slate-300') 
                : 'bg-slate-600 hover:bg-slate-500 border-b-4 border-slate-800 active:border-b-0 active:translate-y-1'}
            `}
          >
            {cell.isRevealed ? (
              cell.isMine ? (
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Hashem&backgroundColor=b6e3f4" 
                  alt="Mine" 
                  className="w-8 h-8"
                />
              ) : (
                <span className={`${
                  cell.neighborMines === 1 ? 'text-blue-600' :
                  cell.neighborMines === 2 ? 'text-green-600' :
                  cell.neighborMines === 3 ? 'text-red-600' :
                  'text-purple-600'
                }`}>
                  {cell.neighborMines > 0 ? cell.neighborMines : ''}
                </span>
              )
            ) : (
              cell.isFlagged && <Flag className="w-5 h-5 text-yellow-400" />
            )}
          </motion.button>
        ))}
      </div>

      {gameOver && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-red-500/90 text-white px-6 py-3 rounded-xl font-bold border-b-4 border-red-700"
        >
          Game Over! Hashem caught you!
        </motion.div>
      )}

      {win && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-green-500/90 text-white px-6 py-3 rounded-xl font-bold border-b-4 border-green-700 flex items-center gap-2"
        >
          <Smile className="w-6 h-6" /> You Won!
        </motion.div>
      )}
      
      <p className="mt-4 text-slate-400 text-xs text-center">
        Long press to flag mines on mobile
      </p>
    </div>
  );
}
