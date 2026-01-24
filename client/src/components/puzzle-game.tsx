import { useState, useEffect, useCallback, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  RotateCcw, 
  Trophy, 
  Clock, 
  Puzzle as PuzzleIcon,
  Sparkles,
  Image as ImageIcon
} from "lucide-react";
import type { Puzzle, PuzzlePiece } from "@shared/schema";
import Confetti from "./confetti";

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

function initializePieces(gridSize: number): PuzzlePiece[] {
  const pieces: PuzzlePiece[] = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      pieces.push({
        id: row * gridSize + col,
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

export function PuzzleGame({ puzzle }: PuzzleGameProps) {
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const gridSize = puzzle.gridSize;

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setImageLoaded(true);
    img.src = puzzle.imageUrl;
  }, [puzzle.imageUrl]);

  useEffect(() => {
    setPieces(initializePieces(gridSize));
    setMoves(0);
    setStartTime(Date.now());
    setIsComplete(false);
  }, [puzzle, gridSize]);

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

  const handleReset = () => {
    setPieces(initializePieces(gridSize));
    setMoves(0);
    setStartTime(Date.now());
    setIsComplete(false);
    setSelectedPiece(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const correctPieces = pieces.filter(
    p => p.currentRow === p.correctRow && p.currentCol === p.correctCol
  ).length;
  const progress = (correctPieces / pieces.length) * 100;

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
    <div className="space-y-6">
      {isComplete && <Confetti />}
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
            <Clock className="h-4 w-4" />
            {formatTime(elapsedTime)}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
            <PuzzleIcon className="h-4 w-4" />
            {moves} moves
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
            <Sparkles className="h-4 w-4" />
            {correctPieces}/{pieces.length} correct
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowReference(!showReference)}
            data-testid="button-toggle-reference"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            {showReference ? "Hide" : "Show"} Reference
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            data-testid="button-reset-puzzle"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
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
              You completed the puzzle in {formatTime(elapsedTime)} with {moves} moves!
            </p>
            <Button onClick={handleReset} className="mt-2" data-testid="button-play-again">
              Play Again
            </Button>
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <Card
          ref={containerRef}
          className="relative aspect-square w-full max-w-lg flex-shrink-0 overflow-hidden p-0"
          data-testid="puzzle-grid"
        >
          <div
            className="grid h-full w-full"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            }}
          >
            {Array.from({ length: gridSize }).map((_, row) =>
              Array.from({ length: gridSize }).map((_, col) => {
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
                      backgroundSize: `${gridSize * 100}%`,
                      backgroundPosition: `${(piece.correctCol / (gridSize - 1)) * 100}% ${(piece.correctRow / (gridSize - 1)) * 100}%`,
                    }}
                    data-testid={`puzzle-piece-${piece.id}`}
                  />
                );
              })
            )}
          </div>
        </Card>

        {showReference && (
          <Card className="overflow-hidden p-0 lg:w-64">
            <img
              src={puzzle.imageUrl}
              alt="Reference"
              className="aspect-square w-full object-cover"
            />
            <div className="p-3 text-center text-sm text-muted-foreground">
              Reference Image
            </div>
          </Card>
        )}
      </div>

      <Card className="p-4">
        <h3 className="mb-2 font-semibold">How to Play</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>Click on a puzzle piece to select it (it will be highlighted)</li>
          <li>Click on another piece to swap their positions</li>
          <li>Pieces in the correct position will have a green glow</li>
          <li>Keep swapping until all pieces are in their correct places!</li>
        </ul>
      </Card>
    </div>
  );
}
