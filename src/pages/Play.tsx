
import React, { useState, useEffect } from 'react';
import { Chess, Move } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import StockfishWorker from 'stockfish.js/stockfish.js?worker';

const Play: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [engine, setEngine] = useState<Worker | null>(null);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [thinking, setThinking] = useState(false);
  const [engineReady, setEngineReady] = useState(false);

  useEffect(() => {
    const worker = new StockfishWorker();
    setEngine(worker);

    worker.onmessage = (event: MessageEvent<string>) => {
      const message = event.data;

      if (message.startsWith('bestmove')) {
        const bestMove = message.split(' ')[1];
        setGame((g) => {
          const gameCopy = new Chess(g.fen());
          if (gameCopy.move(bestMove, { sloppy: true })) {
            return gameCopy;
          }
          return g;
        });
        setThinking(false);
      } else if (message === 'readyok') {
        console.log('Stockfish is ready');
        setEngineReady(true);
      }
    };

    worker.postMessage('uci');
    worker.postMessage('isready');

    return () => {
      worker.postMessage('quit');
      worker.terminate();
    };
  }, []);

  useEffect(() => {
    if (engineReady && engine) {
      let skillLevel = '10';
      if (difficulty === 'easy') skillLevel = '5';
      if (difficulty === 'hard') skillLevel = '20';
      engine.postMessage(`setoption name Skill Level value ${skillLevel}`);
    }
  }, [engine, engineReady, difficulty]);

  const onDrop = (sourceSquare: string, targetSquare: string): boolean => {
    if (thinking || !engineReady) return false;

    const gameCopy = new Chess(game.fen());
    const move: Move | null = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // Always promote to a queen for simplicity
    });

    if (move === null) return false;

    setGame(gameCopy);

    setTimeout(() => {
      if (!gameCopy.isGameOver() && engine) {
        setThinking(true);
        engine.postMessage(`position fen ${gameCopy.fen()}`);
        engine.postMessage('go depth 15');
      }
    }, 250);

    return true;
  };

  const startNewGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setThinking(false);
    if (boardOrientation === 'black' && engineReady && engine) {
      setThinking(true);
      engine.postMessage(`position fen ${newGame.fen()}`);
      engine.postMessage('go depth 15');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 pt-24">
      <h1 className="text-4xl font-bold mb-4">Play vs Computer</h1>

      {!engineReady && <div className="text-lg mb-4">Loading Chess Engine...</div>}

      <div className="mb-4 flex items-center flex-wrap justify-center gap-4">
        <div>
          <label htmlFor="difficulty" className="mr-2">Difficulty:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
            className="p-2 rounded"
            disabled={!engineReady || thinking}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <button
          onClick={() => setBoardOrientation(boardOrientation === 'white' ? 'black' : 'white')}
          className="p-2 rounded bg-blue-500 text-white disabled:bg-blue-300"
          disabled={!engineReady || thinking}
        >
          Flip Board
        </button>
        <button
          onClick={startNewGame}
          className="p-2 rounded bg-green-500 text-white disabled:bg-green-300"
          disabled={!engineReady || thinking}
        >
          New Game
        </button>
      </div>

      <div style={{ width: 'clamp(300px, 80vw, 600px)', position: 'relative' }}>
        <Chessboard
          id="PlayVsStockfish"
          position={game.fen()}
          onPieceDrop={onDrop}
          boardOrientation={boardOrientation}
          arePiecesDraggable={!thinking && engineReady && game.turn() === boardOrientation[0]}
        />
        {thinking && 
          <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center">
            <div className="text-lg font-semibold">Computer is thinking...</div>
          </div>
        }
      </div>
    </div>
  );
};

export default Play;
