
import React, { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import type { Square, PieceSymbol } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import StockfishWorker from 'stockfish.js/stockfish.js?worker';
import { FaFlipboard, FaCog, FaBrain, FaChessPawn, FaCrown } from 'react-icons/fa';

// A simple animation wrapper
const AnimatedDiv: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className, delay }) => (
  <div className={`animate-fadeInUp ${className}`} style={{ animationDelay: `${delay || 0}ms` }}>
    {children}
  </div>
);

const themes = {
  classic: { light: '#eeeed2', dark: '#769656' },
  ocean: { light: '#cce5ff', dark: '#66a3ff' },
  forest: { light: '#d1e7dd', dark: '#528b8b' },
  sunset: { light: '#ffebcc', dark: '#ff8c66' },
};

const Play: React.FC = () => {
  const [gameState, setGameState] = useState('loading'); // 'loading', 'setup', 'playing', 'prompt', 'promotion'
  const [game, setGame] = useState(new Chess());
  const [engine, setEngine] = useState<Worker | null>(null);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [thinking, setThinking] = useState(false);
  const [engineReady, setEngineReady] = useState(false);
  const [engineName, setEngineName] = useState<'stockfish' | 'lc0' | 'ShashChess' | 'Mali Brothers'>('stockfish');
  const [moveFrom, setMoveFrom] = useState('');
  const [moveTo, setMoveTo] = useState('');
  const [optionSquares, setOptionSquares] = useState({});
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [viewingMove, setViewingMove] = useState<number | null>(null);
  const [reviewFen, setReviewFen] = useState('');
  const [showCheckPopup, setShowCheckPopup] = useState(false);
  const [showCheckmatePopup, setShowCheckmatePopup] = useState(false);
  const [boardTheme, setBoardTheme] = useState<keyof typeof themes>('classic');

  // Load theme from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('chessBoardTheme') as keyof typeof themes;
    if (savedTheme && themes[savedTheme]) {
      setBoardTheme(savedTheme);
    }
  }, []);

  // Save theme to local storage
  useEffect(() => {
    localStorage.setItem('chessBoardTheme', boardTheme);
  }, [boardTheme]);

  // Load game from local storage
  useEffect(() => {
    const savedGame = localStorage.getItem('chessGameState');
    if (savedGame) {
      setGameState('prompt');
    } else {
      setGameState('setup');
    }
  }, []);

  const loadSavedGame = () => {
    const savedGame = localStorage.getItem('chessGameState');
    if (savedGame) {
      const { fen, orientation, difficulty: savedDifficulty, engine, history } = JSON.parse(savedGame);
      const gameCopy = new Chess(fen);
      setGame(gameCopy);
      setBoardOrientation(orientation);
      setDifficulty(savedDifficulty);
      setEngineName(engine);
      setMoveHistory(history || []);
      setGameState('playing');
    }
  };

  // Save game to local storage
  useEffect(() => {
    if (gameState === 'playing') {
      const chessGameState = {
        fen: game.fen(),
        orientation: boardOrientation,
        difficulty: difficulty,
        engine: engineName,
        history: moveHistory,
      };
      localStorage.setItem('chessGameState', JSON.stringify(chessGameState));
    } else if (gameState === 'setup') {
      localStorage.removeItem('chessGameState');
    }
  }, [game, boardOrientation, difficulty, engineName, gameState, moveHistory]);

  // Initialize engine
  useEffect(() => {
    const worker = new StockfishWorker();
    setEngine(worker);

    worker.onmessage = (event: MessageEvent<string>) => {
      const message = event.data;
      if (message.startsWith('bestmove')) {
        const bestMove = message.split(' ')[1];
        setGame(prevGame => {
            const gameCopy = new Chess(prevGame.fen());
            const moveResult = gameCopy.move(bestMove, { sloppy: true });
            if (moveResult) {
                setMoveHistory(prevHistory => [...prevHistory, moveResult.san]);
            }
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

  // Check for check/checkmate
  useEffect(() => {
    if (game.inCheck()) {
      setShowCheckPopup(true);
      setTimeout(() => setShowCheckPopup(false), 2000);
    }
    if (game.isCheckmate()) {
      setShowCheckmatePopup(true);
    }
  }, [game]);

  // Sound effects for check and checkmate
  useEffect(() => {
    if (showCheckPopup) {
      new Audio('/sounds/check.mp3').play();
    }
  }, [showCheckPopup]);

  useEffect(() => {
    if (showCheckmatePopup) {
      new Audio('/sounds/checkmate.mp3').play();
    }
  }, [showCheckmatePopup]);

  // Effect to update review board
  useEffect(() => {
    if (viewingMove === null || moveHistory.length === 0) {
        setReviewFen('');
        return;
    }
    const tempGame = new Chess();
    try {
        for (let i = 0; i <= viewingMove; i++) {
            tempGame.move(moveHistory[i]);
        }
        setReviewFen(tempGame.fen());
    } catch (e) {
        console.error("Error replaying history:", e);
        setViewingMove(null); // Exit review mode if history is broken
    }
  }, [viewingMove, moveHistory]);


  const handleStartGame = () => {
    if (!engineReady) return;

    let skillLevel = '10';
    if (difficulty === 'easy') skillLevel = '5';
    if (difficulty === 'hard') skillLevel = '20';
    engine?.postMessage(`setoption name Skill Level value ${skillLevel}`);

    const newGame = new Chess();
    setGame(newGame);
    setGameState('playing');
    setMoveFrom('');
    setOptionSquares({});
    setMoveHistory([]);
    setViewingMove(null);
    setShowCheckmatePopup(false);

    if (boardOrientation === 'black') {
      setThinking(true);
      engine?.postMessage(`position fen ${newGame.fen()}`);
      const depth = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;
      engine?.postMessage(`go depth ${depth}`);
    }
  };

  const makeMove = (move: { from: string; to: string; promotion?: PieceSymbol }) => {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);
    if (result) {
        setGame(gameCopy);
        setMoveHistory(history => [...history, result.san]);
        if (!gameCopy.isGameOver()) {
            setThinking(true);
            engine?.postMessage(`position fen ${gameCopy.fen()}`);
            const depth = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;
            engine?.postMessage(`go depth ${depth}`);
        }
    }
    return result;
  }

  function handleMove(from: Square, to: Square) {
    const gameCopy = new Chess(game.fen());
    const piece = gameCopy.get(from);
    if (
      piece?.type === 'p' &&
      ((piece.color === 'w' && from[1] === '7' && to[1] === '8') ||
        (piece.color === 'b' && from[1] === '2' && to[1] === '1'))
    ) {
      setMoveFrom(from);
      setMoveTo(to);
      setGameState('promotion');
      return;
    }
    
    makeMove({ from, to });
    setMoveFrom('');
    setOptionSquares({});
  }

  function onSquareClick(square: Square) {
    if (viewingMove !== null || thinking || gameState !== 'playing' || game.isGameOver() || game.turn() !== boardOrientation[0]) {
        return;
    }

    function showMoves(square: Square) {
        const moves = game.moves({ square, verbose: true });
        if (moves.length === 0) {
            setMoveFrom('');
            setOptionSquares({});
            return;
        }

        setMoveFrom(square);
        const newSquares: { [key: string]: any } = {};
        newSquares[square] = { background: 'rgba(255, 255, 0, 0.4)' };
        moves.forEach((move) => {
            newSquares[move.to] = {
                background:
                    game.get(move.to) && game.get(move.to).color !== game.get(square).color
                        ? 'radial-gradient(circle, rgba(0,0,0,0.4) 85%, transparent 85%)'
                        : 'radial-gradient(circle, rgba(0,0,0,0.4) 25%, transparent 25%)',
            };
        });
        setOptionSquares(newSquares);
    }

    const piece = game.get(square);

    if (moveFrom) {
        if (square === moveFrom) {
            setMoveFrom('');
            setOptionSquares({});
            return;
        }
        if (piece && piece.color === game.turn()) {
            showMoves(square);
            return;
        }
    }

    if (!moveFrom) {
        if (piece && piece.color === game.turn()) {
            showMoves(square);
        }
    } else {
        handleMove(moveFrom as Square, square);
    }
  }

  const onDrop = (sourceSquare: Square, targetSquare: Square): boolean => {
    if (viewingMove !== null || thinking || gameState !== 'playing' || game.isGameOver()) return false;
    
    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });

    if (move === null) {
      return false; // illegal move
    }

    handleMove(sourceSquare, targetSquare);
    return true;
  };

  function onPromotionPieceSelect(piece?: PieceSymbol) {
    if (piece) {
      makeMove({ from: moveFrom, to: moveTo, promotion: piece });
    }
    setMoveFrom('');
    setMoveTo('');
    setGameState('playing');
    setOptionSquares({});
    return true;
  }

  const resetGame = () => {
    setGameState('setup');
    setGame(new Chess());
    setMoveFrom('');
    setOptionSquares({});
    setMoveHistory([]);
    setViewingMove(null);
    setShowCheckmatePopup(false);
  };
  
  const handleMoveClick = (moveIndex: number) => {
    setViewingMove(moveIndex);
  };
  
  const returnToGame = () => {
    setViewingMove(null);
  };

  const movesForDisplay = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    movesForDisplay.push({
      move: i / 2 + 1,
      white: moveHistory[i],
      black: moveHistory[i + 1],
      whiteIndex: i,
      blackIndex: i + 1,
    });
  }

  if (gameState === 'loading') {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pt-32 md:pt-36">
            <FaCog className="animate-spin text-6xl text-primary"/>
        </div>
    )
  }

  if (gameState === 'prompt') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pt-32 md:pt-36">
        <AnimatedDiv className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Continue Game?</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We found a saved game. Would you like to continue or start a new game?
          </p>
        </AnimatedDiv>
        <AnimatedDiv className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md flex gap-4" delay={200}>
          <button
            onClick={loadSavedGame}
            className="w-full p-4 text-xl font-bold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
          >
            Continue Game
          </button>
          <button
            onClick={() => setGameState('setup')}
            className="w-full p-4 text-xl font-bold rounded-lg bg-secondary hover:bg-accent transition-colors"
          >
            New Game
          </button>
        </AnimatedDiv>
      </div>
    );
  }

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pt-32 md:pt-36">
        <AnimatedDiv className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">Play vs Computer</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your settings and challenge our advanced chess engine/bots.
          </p>
        </AnimatedDiv>
        <AnimatedDiv className="bg-card p-8 rounded-lg shadow-lg w-full max-w-md" delay={200}>
          <div className="mb-6">
            <label className="block text-lg font-medium text-muted-foreground mb-3">Chess Engine/bots</label>
            <div className="grid grid-cols-2 gap-3">
              {['stockfish', 'lc0', 'ShashChess', 'Mali Brothers'].map((eng) => (
                <button
                  key={eng}
                  onClick={() => setEngineName(eng as any)}
                  className={`w-full p-3 rounded-lg font-semibold transition-all duration-300 ${
                    engineName === eng ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'bg-secondary hover:bg-accent'
                  }`}
                >
                  {eng.charAt(0).toUpperCase() + eng.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-lg font-medium text-muted-foreground mb-3">Difficulty</label>
            <div className="flex justify-between gap-3">
              {['easy', 'medium', 'hard'].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level as any)}
                  className={`w-full p-3 rounded-lg font-semibold transition-all duration-300 ${
                    difficulty === level ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'bg-secondary hover:bg-accent'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-8">
            <label className="block text-lg font-medium text-muted-foreground mb-3">Play As</label>
            <div className="flex justify-between gap-3">
              <button onClick={() => setBoardOrientation('white')} className={`w-full p-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                boardOrientation === 'white' ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'bg-secondary hover:bg-accent'
              }`}>
                <FaChessPawn/> White
              </button>
              <button onClick={() => setBoardOrientation('black')} className={`w-full p-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                boardOrientation === 'black' ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'bg-secondary hover:bg-accent'
              }`}>
                <FaCrown/> Black
              </button>
            </div>
          </div>
          <button
            onClick={handleStartGame}
            disabled={!engineReady}
            className="w-full p-4 text-xl font-bold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              position={viewingMove === null ? game.fen() : reviewFen}
              onPieceDrop={onDrop}
              onSquareClick={onSquareClick}
              customSquareStyles={optionSquares}
              boardOrientation={boardOrientation}
              arePiecesDraggable={gameState === 'playing' && viewingMove === null && !thinking && !game.isGameOver() && game.turn() === boardOrientation[0]}
              customDarkSquareStyle={{ backgroundColor: themes[boardTheme].dark }}
              customLightSquareStyle={{ backgroundColor: themes[boardTheme].light }}
              customDropSquareStyle={{ boxShadow: 'inset 0 0 1px 4px rgba(186,202,68,0.7)' }}
              onPromotionPieceSelect={onPromotionPieceSelect}
              promotionDialogVariant="modal"
            />
            {gameState === 'promotion' && (
              <div className="absolute inset-0 bg-background/80 flex justify-center items-center">
                <div className="bg-card p-8 rounded-lg shadow-2xl text-center">
                  <h2 className="text-2xl font-bold mb-4">Promote Pawn</h2>
                  <div className="flex justify-center gap-4">
                    {['q', 'r', 'b', 'n'].map((piece) => (
                      <button
                        key={piece}
                        onClick={() => onPromotionPieceSelect(piece as PieceSymbol)}
                        className="w-16 h-16 rounded-lg bg-secondary hover:bg-accent flex justify-center items-center text-4xl font-bold"
                      >
                        {piece.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {thinking && (
              <div className="absolute inset-0 bg-background/80 flex justify-center items-center">
                  <div className="text-xl font-semibold flex items-center gap-2 text-primary">
                  <FaBrain className="animate-pulse" /><span>Computer is thinking...</span>
                  </div>
              </div>
            )}
            {showCheckPopup && (
              <div className="absolute inset-0 bg-background/80 flex justify-center items-center">
                  <div className="text-4xl font-bold text-red-500 animate-ping">Check!</div>
              </div>
            )}
            {showCheckmatePopup && (
              <div className="absolute inset-0 bg-background/80 flex justify-center items-center">
                  <div className="text-center">
                      <div className="text-6xl font-bold text-red-600">Checkmate!</div>
                      <button onClick={resetGame} className="mt-4 p-2 rounded-lg bg-primary text-primary-foreground">Play Again</button>
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
            <div className="text-center text-xl font-bold text-red-500">
                {game.isCheckmate() ? 'Checkmate!' : game.inCheck() ? 'Check!' : ''}
            </div>
            <div className="flex flex-col gap-4 mt-4">
                <button
                    onClick={resetGame}
                    className="flex items-center justify-center gap-2 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    <FaCog />
                    <span>New Game</span>
                </button>
                <button
                    onClick={() => setBoardOrientation(boardOrientation === 'white' ? 'black' : 'white')}
                    className="flex items-center justify-center gap-2 p-3 rounded-lg bg-secondary hover:bg-accent transition-colors"
                    disabled={thinking || viewingMove !== null}
                >
                    <FaFlipboard />
                    <span>Flip Board</span>
                </button>
            </div>
             <div className="mt-4">
                <h3 className="text-xl font-bold text-center text-primary mb-2">Board Theme</h3>
                <div className="grid grid-cols-2 gap-2">
                    {Object.keys(themes).map((theme) => (
                        <button
                            key={theme}
                            onClick={() => setBoardTheme(theme as keyof typeof themes)}
                            className={`p-2 rounded-lg text-sm font-semibold transition-all ${
                                boardTheme === theme ? 'bg-primary text-primary-foreground scale-105' : 'bg-secondary hover:bg-accent'
                            }`}
                        >
                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
            <div className="mt-4">
                <h3 className="text-xl font-bold text-center text-primary mb-2">Move History</h3>
                <div className="flex flex-col gap-2 h-48 overflow-y-auto bg-secondary p-2 rounded-lg">
                    {movesForDisplay.map(({ move, white, black, whiteIndex, blackIndex }) => (
                        <div key={move} className="grid grid-cols-[auto_1fr_1fr] items-center gap-2 text-sm">
                            <span className="font-bold text-muted-foreground">{move}.</span>
                            <button
                                onClick={() => handleMoveClick(whiteIndex)}
                                className={`p-2 rounded-lg font-semibold ${viewingMove === whiteIndex ? 'bg-primary text-primary-foreground' : 'bg-white text-black'}`}
                            >
                                {white}
                            </button>
                            {black && (
                                <button
                                    onClick={() => handleMoveClick(blackIndex)}
                                    className={`p-2 rounded-lg font-semibold ${viewingMove === blackIndex ? 'bg-primary text-primary-foreground' : 'bg-black text-white'}`}
                                >
                                    {black}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {viewingMove !== null && (
                    <button onClick={returnToGame} className="w-full mt-4 p-2 rounded-lg bg-primary text-primary-foreground">Back to Game</button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Play;
