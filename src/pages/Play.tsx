
import React, { useState, useEffect, useCallback } from 'react';
import { Chess, Move } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import StockfishWorker from 'stockfish.js/stockfish.js?worker';
import { FaFlipboard, FaCog, FaBrain, FaChessPawn, FaCrown } from 'react-icons/fa';

// A simple animation wrapper
const AnimatedDiv: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className, delay }) => (
  <div className={`animate-fadeInUp ${className}`} style={{ animationDelay: `${delay || 0}ms` }}>
    {children}
  </div>
);

const Play: React.FC = () => {
  const [gameState, setGameState] = useState('setup'); // 'setup', 'playing'
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
          gameCopy.move(bestMove, { sloppy: true });
          return gameCopy;
        });
        setThinking(false);
      } else if (message === 'readyok') {
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

  const handleStartGame = () => {
    if (!engineReady) return;

    let skillLevel = '10';
    if (difficulty === 'easy') skillLevel = '5';
    if (difficulty === 'hard') skillLevel = '20';
    engine?.postMessage(`setoption name Skill Level value ${skillLevel}`);

    const newGame = new Chess();
    setGame(newGame);
    setGameState('playing');

    if (boardOrientation === 'black') {
      setThinking(true);
      engine?.postMessage(`position fen ${newGame.fen()}`);
      engine?.postMessage('go depth 15');
    }
  };

  const onDrop = (sourceSquare: string, targetSquare: string): boolean => {
    if (thinking || gameState !== 'playing' || game.isGameOver()) return false;

    const gameCopy = new Chess(game.fen());
    const move: Move | null = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });

    if (move === null) return false;
    setGame(gameCopy);

    if (!gameCopy.isGameOver()) {
      setThinking(true);
      engine?.postMessage(`position fen ${gameCopy.fen()}`);
      engine?.postMessage('go depth 15');
    }
    return true;
  };

  const resetGame = () => {
    setGameState('setup');
    setGame(new Chess());
  };

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pt-32 md:pt-36">
        <AnimatedDiv className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Play vs Computer</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your settings and challenge our advanced chess engine.
          </p>
        </AnimatedDiv>
        <AnimatedDiv className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md" delay={200}>
          <div className="mb-6">
            <label className="block text-lg font-medium text-muted-foreground mb-3">Difficulty</label>
            <div className="flex justify-between gap-3">
              {['easy', 'medium', 'hard'].map((level) => (
                <button 
                  key={level}
                  onClick={() => setDifficulty(level as any)}
                  className={`w-full p-3 rounded-lg font-semibold transition-all duration-300 ${
                    difficulty === level ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'bg-muted hover:bg-accent'
                  }`}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <label className="block text-lg font-medium text-muted-foreground mb-3">Play As</label>
            <div className="flex justify-between gap-3">
              <button onClick={() => setBoardOrientation('white')} className={`w-full p-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                boardOrientation === 'white' ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'bg-muted hover:bg-accent'
              }`}>
                <FaChessPawn/> White
              </button>
              <button onClick={() => setBoardOrientation('black')} className={`w-full p-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                boardOrientation === 'black' ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'bg-muted hover:bg-accent'
              }`}>
                <FaCrown/> Black
              </button>
            </div>
          </div>
          <button 
            onClick={handleStartGame} 
            disabled={!engineReady}
            className="w-full p-4 text-xl font-bold rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {engineReady ? 'Start Game' : <><FaCog className="animate-spin mr-2"/> Loading Engine...</>}
          </button>
        </AnimatedDiv>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center p-4 pt-32 md:pt-40 animate-fadeIn">
      <div className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="flex-grow flex flex-col items-center gap-4">
          <div className="w-full max-w-lg aspect-square relative shadow-2xl rounded-lg overflow-hidden">
            <Chessboard
              id="PlayVsStockfish"
              position={game.fen()}
              onPieceDrop={onDrop}
              boardOrientation={boardOrientation}
              arePiecesDraggable={!thinking && !game.isGameOver() && game.turn() === boardOrientation[0]}
              customDarkSquareStyle={{ backgroundColor: '#769656' }}
              customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
              customDropSquareStyle={{ boxShadow: 'inset 0 0 1px 4px rgba(186,202,68,0.7)' }}
            />
            {thinking && (
              <div className="absolute inset-0 bg-background/80 flex justify-center items-center">
                <div className="text-xl font-semibold flex items-center gap-2 text-primary">
                  <FaBrain className="animate-pulse" />
                  <span>Computer is thinking...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-72 bg-card p-6 rounded-lg shadow-lg flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-center text-primary">Game Info</h2>
            <div className="text-center text-xl font-medium text-muted-foreground">
                {game.isGameOver() ? `Game Over - ${game.isCheckmate() ? 'Checkmate!' : 'Draw'}` : `It's ${game.turn() === 'w' ? 'White' : 'Black'}'s turn`}
            </div>
            <div className="flex flex-col gap-4 mt-4">
                <button
                    onClick={resetGame}
                    className="flex items-center justify-center gap-2 p-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors"
                >
                    <FaCog />
                    <span>New Game</span>
                </button>
                <button
                    onClick={() => setBoardOrientation(boardOrientation === 'white' ? 'black' : 'white')}
                    className="flex items-center justify-center gap-2 p-3 rounded-lg bg-muted hover:bg-accent transition-colors"
                    disabled={thinking}
                >
                    <FaFlipboard />
                    <span>Flip Board</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Play;
