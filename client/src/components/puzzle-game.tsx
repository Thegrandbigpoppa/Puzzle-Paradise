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
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";

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

interface DraggablePieceProps {
  piece: PuzzlePiece;
  imageUrl: string;
  cols: number;
  rows: number;
  isCorrect: boolean;
  isComplete: boolean;
  isDragging: boolean;
}

function DraggablePiece({ piece, imageUrl, cols, rows, isCorrect, isComplete, isDragging }: DraggablePieceProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `piece-${piece.id}`,
    disabled: isComplete,
  });

  const style: React.CSSProperties = {
    backgroundImage: `url(${imageUrl})`,
    backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${cols > 1 ? (piece.correctCol / (cols - 1)) * 100 : 50}% ${rows > 1 ? (piece.correctRow / (rows - 1)) * 100 : 50}%`,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: isComplete ? 'default' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`relative h-full w-full overflow-hidden border border-border/30 transition-opacity duration-200 touch-none ${
        isCorrect && !isComplete ? "ring-2 ring-green-500/50" : ""
      }`}
      style={style}
      data-testid={`puzzle-piece-${piece.id}`}
    />
  );
}

interface DroppableCellProps {
  row: number;
  col: number;
  children: React.ReactNode;
  isOver: boolean;
}

function DroppableCell({ row, col, children, isOver }: DroppableCellProps) {
  const { setNodeRef, isOver: cellIsOver } = useDroppable({
    id: `cell-${row}-${col}`,
    data: { row, col },
  });

  return (
    <div
      ref={setNodeRef}
      className={`relative transition-all duration-150 ${
        (isOver || cellIsOver) ? "ring-2 ring-primary ring-inset bg-primary/10" : ""
      }`}
    >
      {children}
    </div>
  );
}

interface DragOverlayPieceProps {
  piece: PuzzlePiece;
  imageUrl: string;
  cols: number;
  rows: number;
  containerWidth: number;
  containerHeight: number;
}

function DragOverlayPiece({ piece, imageUrl, cols, rows, containerWidth, containerHeight }: DragOverlayPieceProps) {
  const pieceWidth = containerWidth > 0 ? containerWidth / cols : 80;
  const pieceHeight = containerHeight > 0 ? containerHeight / rows : 80;

  return (
    <div
      className="overflow-hidden border-2 border-primary shadow-2xl ring-4 ring-primary/30"
      style={{
        width: pieceWidth,
        height: pieceHeight,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${cols * 100}% ${rows * 100}%`,
        backgroundPosition: `${cols > 1 ? (piece.correctCol / (cols - 1)) * 100 : 50}% ${rows > 1 ? (piece.correctRow / (rows - 1)) * 100 : 50}%`,
        transform: 'scale(1.05)',
      }}
    />
  );
}

export function PuzzleGame({ puzzle }: PuzzleGameProps) {
  const [currentCut, setCurrentCut] = useState<PuzzleCut>(() => getDefaultCut(puzzle.gridSize));
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showReference, setShowReference] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 1, height: 1 });
  const [cutSelectorOpen, setCutSelectorOpen] = useState(false);
  const [activePieceId, setActivePieceId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setImageLoaded(true);
    };
    img.src = puzzle.imageUrl;
  }, [puzzle.imageUrl]);

  useEffect(() => {
    setPieces(initializePieces(currentCut.cols, currentCut.rows));
    setMoves(0);
    setStartTime(Date.now());
    setIsComplete(false);
    setActivePieceId(null);
  }, [puzzle, currentCut]);

  useEffect(() => {
    if (isComplete) return;
    
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, isComplete]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const checkCompletion = useCallback((updatedPieces: PuzzlePiece[]) => {
    const allCorrect = updatedPieces.every(
      p => p.currentRow === p.correctRow && p.currentCol === p.correctCol
    );
    if (allCorrect) {
      setIsComplete(true);
    }
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const pieceId = parseInt(String(event.active.id).replace('piece-', ''));
    setActivePieceId(pieceId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActivePieceId(null);

    if (!over) return;

    const draggedPieceId = parseInt(String(active.id).replace('piece-', ''));
    const overId = String(over.id);
    
    setPieces(prevPieces => {
      let targetRow: number;
      let targetCol: number;
      
      if (overId.startsWith('cell-')) {
        const [, targetRowStr, targetColStr] = overId.split('-');
        targetRow = parseInt(targetRowStr);
        targetCol = parseInt(targetColStr);
      } else if (overId.startsWith('piece-')) {
        const targetPieceId = parseInt(overId.replace('piece-', ''));
        const targetPiece = prevPieces.find(p => p.id === targetPieceId);
        if (!targetPiece) return prevPieces;
        targetRow = targetPiece.currentRow;
        targetCol = targetPiece.currentCol;
      } else {
        return prevPieces;
      }

      const draggedPiece = prevPieces.find(p => p.id === draggedPieceId);
      if (!draggedPiece) return prevPieces;

      if (draggedPiece.currentRow === targetRow && draggedPiece.currentCol === targetCol) {
        return prevPieces;
      }

      const targetPiece = prevPieces.find(p => p.currentRow === targetRow && p.currentCol === targetCol);
      if (!targetPiece) return prevPieces;

      const updatedPieces = prevPieces.map(p => {
        if (p.id === draggedPieceId) {
          return { ...p, currentRow: targetRow, currentCol: targetCol };
        }
        if (p.id === targetPiece.id) {
          return { ...p, currentRow: draggedPiece.currentRow, currentCol: draggedPiece.currentCol };
        }
        return p;
      });
      
      setMoves(m => m + 1);
      checkCompletion(updatedPieces);
      return updatedPieces;
    });
  };

  const handleShuffle = () => {
    setPieces(initializePieces(currentCut.cols, currentCut.rows));
    setActivePieceId(null);
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
    setActivePieceId(null);
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

  const activePiece = activePieceId !== null ? pieces.find(p => p.id === activePieceId) : null;

  // Calculate the actual image aspect ratio
  const imageAspectRatio = imageDimensions.width / imageDimensions.height;
  
  // Scale canvas size based on piece count - larger puzzles get bigger canvas
  // Base: 512px for small puzzles, up to 768px for large ones
  const getMaxWidth = () => {
    const pieces = currentCut.pieces;
    if (pieces <= 25) return 512;
    if (pieces <= 50) return 576;
    if (pieces <= 100) return 640;
    if (pieces <= 150) return 704;
    return 768; // max-w-3xl equivalent
  };
  const maxCanvasWidth = getMaxWidth();

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
        onToggleHint={() => setShowHint(!showHint)}
        showHint={showHint}
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
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <Card
              ref={containerRef}
              className="relative w-full flex-shrink-0 overflow-hidden p-0"
              style={{ 
                aspectRatio: imageAspectRatio,
                maxWidth: `${maxCanvasWidth}px`
              }}
              data-testid="puzzle-grid"
            >
              {showHint && (
                <img
                  src={puzzle.imageUrl}
                  alt="Hint"
                  className="absolute inset-0 z-10 h-full w-full object-cover opacity-50 pointer-events-none"
                  data-testid="hint-overlay"
                />
              )}
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
                    
                    const isCorrect = piece.currentRow === piece.correctRow && piece.currentCol === piece.correctCol;
                    const isDragging = activePieceId === piece.id;
                    
                    return (
                      <DroppableCell
                        key={`${row}-${col}`}
                        row={row}
                        col={col}
                        isOver={false}
                      >
                        <DraggablePiece
                          piece={piece}
                          imageUrl={puzzle.imageUrl}
                          cols={currentCut.cols}
                          rows={currentCut.rows}
                          isCorrect={isCorrect}
                          isComplete={isComplete}
                          isDragging={isDragging}
                        />
                      </DroppableCell>
                    );
                  })
                )}
              </div>
            </Card>

            <DragOverlay dropAnimation={null}>
              {activePiece && (
                <DragOverlayPiece
                  piece={activePiece}
                  imageUrl={puzzle.imageUrl}
                  cols={currentCut.cols}
                  rows={currentCut.rows}
                  containerWidth={containerSize.width}
                  containerHeight={containerSize.height}
                />
              )}
            </DragOverlay>
          </DndContext>

          {showReference && (
            <Card className="overflow-hidden p-0 lg:w-64 flex-shrink-0">
              <img
                src={puzzle.imageUrl}
                alt="Reference"
                className="w-full object-cover"
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
