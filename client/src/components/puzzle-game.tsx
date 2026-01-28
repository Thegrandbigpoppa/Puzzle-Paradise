import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Puzzle as PuzzleIcon,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Puzzle, PuzzlePiece, PuzzleCut } from "@shared/schema";
import { puzzleCutOptions } from "@shared/schema";
import Confetti from "./confetti";
import { PuzzleSidebar } from "./puzzle-sidebar";
import { PuzzleCutSelector } from "./puzzle-cut-selector";

interface PuzzleGameProps {
  puzzle: Puzzle;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function initializePieces(cols: number, rows: number): PuzzlePiece[] {
  const pieces: PuzzlePiece[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pieces.push({
        id: row * cols + col,
        correctRow: row,
        correctCol: col,
        currentRow: row,
        currentCol: col,
        isPlaced: false,
      });
    }
  }
  
  const shuffled = shuffleArray(pieces.map(p => ({ row: p.currentRow, col: p.currentCol })));
  pieces.forEach((piece, index) => {
    piece.currentRow = shuffled[index].row;
    piece.currentCol = shuffled[index].col;
  });
  
  return pieces;
}

function getDefaultCut(gridSize: number): PuzzleCut {
  const totalPieces = gridSize * gridSize;
  const exactMatch = puzzleCutOptions.find(c => c.pieces === totalPieces);
  if (exactMatch) return exactMatch;
  
  const closestMatch = puzzleCutOptions.reduce((prev, curr) => 
    Math.abs(curr.pieces - totalPieces) < Math.abs(prev.pieces - totalPieces) ? curr : prev
  );
  return closestMatch;
}

export function PuzzleGame({ puzzle }: PuzzleGameProps) {
  const [currentCut, setCurrentCut] = useState<PuzzleCut>(() => getDefaultCut(puzzle.gridSize));
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [cutSelectorOpen, setCutSelectorOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setImageLoaded(true);
    img.src = puzzle.imageUrl;
  }, [puzzle.imageUrl]);

  useEffect(() => {
    setPieces(initializePieces(currentCut.cols, currentCut.rows));
    setMoves(0);
    setStartTime(Date.now());
    setIsComplete(false);
    setSelectedPiece(null);
  }, [puzzle, currentCut]);

  useEffect(() => {
    if (isComplete) return;
    
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, isComplete]);

  const checkCompletion = useCallback((updatedPieces: PuzzlePiece[]) => {
    const allCorrect = updatedPieces.every(
      p => p.currentRow === p.correctRow && p.currentCol === p.correctCol
    );
    if (allCorrect) {
      setIsComplete(true);
    }
  }, []);

  const handlePieceClick = (pieceId: number) => {
    if (isComplete) return;

    if (selectedPiece === null) {
      setSelectedPiece(pieceId);
    } else if (selectedPiece === pieceId) {
      setSelectedPiece(null);
    } else {
      const piece1 = pieces.find(p => p.id === selectedPiece)!;
      const piece2 = pieces.find(p => p.id === pieceId)!;
      
      const updatedPieces = pieces.map(p => {
        if (p.id === selectedPiece) {
          return { ...p, currentRow: piece2.currentRow, currentCol: piece2.currentCol };
        }
        if (p.id === pieceId) {
          return { ...p, currentRow: piece1.currentRow, currentCol: piece1.currentCol };
        }
        return p;
      });
      
      setPieces(updatedPieces);
      setMoves(m => m + 1);
      setSelectedPiece(null);
      checkCompletion(updatedPieces);
    }
  };

  const handleShuffle = () => {
    setPieces(initializePieces(currentCut.cols, currentCut.rows));
    setSelectedPiece(null);
    setMoves(m => m + 1);
  };

  const handleAutoSolve = () => {
    const solvedPieces = pieces.map(p => ({
      ...p,
      currentRow: p.correctRow,
      currentCol: p.correctCol,
    }));
    setPieces(solvedPieces);
    setIsComplete(true);
  };

  const handleStartOver = () => {
    setPieces(initializePieces(currentCut.cols, currentCut.rows));
    setMoves(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsComplete(false);
    setSelectedPiece(null);
  };

  const handleCutChange = (cut: PuzzleCut) => {
    setCurrentCut(cut);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const correctPieces = pieces.filter(
    p => p.currentRow === p.correctRow && p.currentCol === p.correctCol
  ).length;
  const progress = pieces.length > 0 ? (correctPieces / pieces.length) * 100 : 0;

  const getPieceAtPosition = (row: number, col: number) => {
    return pieces.find(p => p.currentRow === row && p.currentCol === col);
  };

  if (!imageLoaded) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {isComplete && <Confetti />}
      
      <PuzzleCutSelector
        open={cutSelectorOpen}
        onOpenChange={setCutSelectorOpen}
        currentCut={currentCut}
        onSelectCut={handleCutChange}
      />

      <PuzzleSidebar
        puzzleName={puzzle.name}
        puzzleImage={puzzle.imageUrl}
        currentCut={currentCut}
        elapsedTime={formatTime(elapsedTime)}
        onChangeCut={() => setCutSelectorOpen(true)}
        onShuffle={handleShuffle}
        onAutoSolve={handleAutoSolve}
        onStartOver={handleStartOver}
        onToggleReference={() => setShowReference(!showReference)}
        showReference={showReference}
      />

      <div className="flex-1 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
              <PuzzleIcon className="h-4 w-4" />
              {moves} moves
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
              <Sparkles className="h-4 w-4" />
              {correctPieces}/{pieces.length} correct
            </Badge>
          </div>
        </div>

        <Progress value={progress} className="h-2" />

        {isComplete && (
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                <Trophy className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold">Congratulations!</h2>
              <p className="text-muted-foreground">
                You completed the {currentCut.pieces} piece puzzle in {formatTime(elapsedTime)} with {moves} moves!
              </p>
              <Button onClick={handleStartOver} className="mt-2" data-testid="button-play-again">
                Play Again
              </Button>
            </div>
          </Card>
        )}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <Card
            ref={containerRef}
            className="relative w-full max-w-2xl flex-shrink-0 overflow-hidden p-0"
            style={{ aspectRatio: `${currentCut.cols} / ${currentCut.rows}` }}
            data-testid="puzzle-grid"
          >
            <div
              className="grid h-full w-full"
              style={{
                gridTemplateColumns: `repeat(${currentCut.cols}, 1fr)`,
                gridTemplateRows: `repeat(${currentCut.rows}, 1fr)`,
              }}
            >
              {Array.from({ length: currentCut.rows }).map((_, row) =>
                Array.from({ length: currentCut.cols }).map((_, col) => {
                  const piece = getPieceAtPosition(row, col);
                  if (!piece) return null;
                  
                  const isSelected = selectedPiece === piece.id;
                  const isCorrect = piece.currentRow === piece.correctRow && piece.currentCol === piece.correctCol;
                  
                  return (
                    <button
                      key={`${row}-${col}`}
                      onClick={() => handlePieceClick(piece.id)}
                      disabled={isComplete}
                      className={`relative overflow-hidden border border-border/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                        isSelected
                          ? "ring-4 ring-primary ring-offset-2 z-10 scale-105"
                          : "hover:brightness-110"
                      } ${isCorrect && !isComplete ? "ring-2 ring-green-500/50" : ""}`}
                      style={{
                        backgroundImage: `url(${puzzle.imageUrl})`,
                        backgroundSize: `${currentCut.cols * 100}% ${currentCut.rows * 100}%`,
                        backgroundPosition: `${currentCut.cols > 1 ? (piece.correctCol / (currentCut.cols - 1)) * 100 : 50}% ${currentCut.rows > 1 ? (piece.correctRow / (currentCut.rows - 1)) * 100 : 50}%`,
                      }}
                      data-testid={`puzzle-piece-${piece.id}`}
                    />
                  );
                })
              )}
            </div>
          </Card>

          {showReference && (
            <Card className="overflow-hidden p-0 lg:w-64 flex-shrink-0">
              <img
                src={puzzle.imageUrl}
                alt="Reference"
                className="w-full object-cover"
                style={{ aspectRatio: `${currentCut.cols} / ${currentCut.rows}` }}
              />
              <div className="p-3 text-center text-sm text-muted-foreground">
                Reference Image
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
