
import React, { useState, useEffect, useMemo } from 'react';
import { Chess } from 'chess.js';
import Chessboard from 'react-chessboard';
import { Stockfish } from 'stockfish/src/stockfish';

const Play: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [thinking, setThinking] = useState(false);

  const stockfish = useMemo(() => new Stockfish(), []);

  useEffect(() => {
    stockfish.onmessage = (event: any) => {
      const message = event.data;
      if (message.startsWith('bestmove')) {
        const bestMove = message.split(' ')[1];
        const gameCopy = new Chess(game.fen());
        gameCopy.move(bestMove);
        setGame(gameCopy);
        setThinking(false);
      }
    };

    stockfish.postMessage('uci');
    stockfish.postMessage('isready');
    setDifficultyHandler(difficulty);
  }, [game, stockfish, difficulty]);

  const setDifficultyHandler = (level: 'easy' | 'medium' | 'hard') => {
    let skillLevel = '10';
    if (level === 'easy') skillLevel = '5';
    if (level === 'hard') skillLevel = '20';
    stockfish.postMessage(`setoption name Skill Level value ${skillLevel}`);
    setDifficulty(level);
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });

    if (move === null) return false;

    setGame(gameCopy);

    if (gameCopy.isGameOver()) {
      // Handle game over
    } else {
      setThinking(true);
      stockfish.postMessage(`position fen ${gameCopy.fen()}`);
      stockfish.postMessage('go depth 15');
    }

    return true;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-4">Play vs Computer</h1>
      <div className="mb-4">
        <label htmlFor="difficulty" className="mr-2">Difficulty:</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficultyHandler(e.target.value as 'easy' | 'medium' | 'hard')}
          className="p-2 rounded"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <button
          onClick={() => setBoardOrientation(boardOrientation === 'white' ? 'black' : 'white')}
          className="ml-4 p-2 rounded bg-blue-500 text-white"
        >
          Flip Board
        </button>
        <button
          onClick={() => setGame(new Chess())}
          className="ml-4 p-2 rounded bg-green-500 text-white"
        >
          New Game
        </button>
      </div>
      <div style={{ width: 'clamp(300px, 80vw, 600px)' }}>
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          boardOrientation={boardOrientation}
        />
      </div>
      {thinking && <div className="mt-4 text-lg">Computer is thinking...</div>}
    </div>
  );
};

export default Play;
