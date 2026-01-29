import { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
import { generateAllPieceEdges, generatePiecePath, type PieceEdges } from "@/lib/puzzle-piece-shapes";

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

interface ExtendedPuzzlePiece extends PuzzlePiece {
  isInTray: boolean;
  trayIndex: number;
}

function initializePieces(cols: number, rows: number): ExtendedPuzzlePiece[] {
  const pieces: ExtendedPuzzlePiece[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pieces.push({
        id: row * cols + col,
        correctRow: row,
        correctCol: col,
        currentRow: -1,
        currentCol: -1,
        isPlaced: false,
        isInTray: true,
        trayIndex: row * cols + col,
      });
    }
  }
  
  const shuffledIndices = shuffleArray(pieces.map((_, i) => i));
  pieces.forEach((piece, index) => {
    piece.trayIndex = shuffledIndices[index];
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

interface JigsawPieceProps {
  piece: ExtendedPuzzlePiece;
  imageUrl: string;
  cols: number;
  rows: number;
  edges: PieceEdges;
  pieceWidth: number;
  pieceHeight: number;
  isComplete: boolean;
  isDragging: boolean;
  scale?: number;
}

function JigsawPiece({ 
  piece, 
  imageUrl, 
  cols, 
  rows, 
  edges, 
  pieceWidth, 
  pieceHeight, 
  isComplete, 
  isDragging,
  scale = 1
}: JigsawPieceProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `piece-${piece.id}`,
    disabled: isComplete || piece.isPlaced,
  });

  const tabSize = 0.2;
  const extraW = pieceWidth * tabSize;
  const extraH = pieceHeight * tabSize;
  const totalWidth = pieceWidth + extraW * 2;
  const totalHeight = pieceHeight + extraH * 2;
  
  const clipId = `clip-${piece.id}`;
  const path = generatePiecePath(edges, pieceWidth, pieceHeight, tabSize);
  
  const bgPosX = cols > 1 ? (piece.correctCol / (cols - 1)) * 100 : 50;
  const bgPosY = rows > 1 ? (piece.correctRow / (rows - 1)) * 100 : 50;

  const style: React.CSSProperties = {
    width: totalWidth * scale,
    height: totalHeight * scale,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: isComplete || piece.isPlaced ? 'default' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="touch-none flex-shrink-0"
      style={style}
      data-testid={`puzzle-piece-${piece.id}`}
    >
      <svg 
        width={totalWidth * scale} 
        height={totalHeight * scale} 
        viewBox={`${-extraW} ${-extraH} ${totalWidth} ${totalHeight}`}
        className="overflow-visible"
      >
        <defs>
          <clipPath id={clipId}>
            <path d={path} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <image
            href={imageUrl}
            x={-piece.correctCol * pieceWidth}
            y={-piece.correctRow * pieceHeight}
            width={cols * pieceWidth}
            height={rows * pieceHeight}
            preserveAspectRatio="none"
          />
        </g>
        <path 
          d={path} 
          fill="none" 
          stroke="rgba(0,0,0,0.3)" 
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}

interface BoardSlotProps {
  row: number;
  col: number;
  pieceWidth: number;
  pieceHeight: number;
  edges: PieceEdges;
  hasPiece: boolean;
  isCorrectSlot: boolean;
  children?: React.ReactNode;
}

function BoardSlot({ row, col, pieceWidth, pieceHeight, edges, hasPiece, isCorrectSlot, children }: BoardSlotProps) {
  const tabSize = 0.2;
  const extraW = pieceWidth * tabSize;
  const extraH = pieceHeight * tabSize;
  const totalWidth = pieceWidth + extraW * 2;
  const totalHeight = pieceHeight + extraH * 2;
  
  const { setNodeRef } = useDroppable({
    id: `slot-${row}-${col}`,
    data: { row, col },
  });

  return (
    <div
      ref={setNodeRef}
      className="relative"
      style={{
        width: totalWidth,
        height: totalHeight,
        marginLeft: col === 0 ? 0 : -extraW,
        marginTop: row === 0 ? 0 : -extraH,
      }}
    >
      <div 
        className="absolute"
        style={{
          left: extraW,
          top: extraH,
          width: pieceWidth,
          height: pieceHeight,
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface PlacedPieceProps {
  piece: ExtendedPuzzlePiece;
  imageUrl: string;
  cols: number;
  rows: number;
  edges: PieceEdges;
  pieceWidth: number;
  pieceHeight: number;
}

function PlacedPiece({ piece, imageUrl, cols, rows, edges, pieceWidth, pieceHeight }: PlacedPieceProps) {
  const tabSize = 0.2;
  const extraW = pieceWidth * tabSize;
  const extraH = pieceHeight * tabSize;
  const totalWidth = pieceWidth + extraW * 2;
  const totalHeight = pieceHeight + extraH * 2;
  
  const clipId = `placed-clip-${piece.id}-${Date.now()}`;
  const path = generatePiecePath(edges, pieceWidth, pieceHeight, tabSize);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: -extraW * 2,
        top: -extraH * 2,
        width: totalWidth,
        height: totalHeight,
      }}
    >
      <svg 
        width={totalWidth} 
        height={totalHeight} 
        viewBox={`${-extraW} ${-extraH} ${totalWidth} ${totalHeight}`}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={path} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <image
            href={imageUrl}
            x={-piece.correctCol * pieceWidth}
            y={-piece.correctRow * pieceHeight}
            width={cols * pieceWidth}
            height={rows * pieceHeight}
            preserveAspectRatio="none"
          />
        </g>
        <path 
          d={path} 
          fill="none" 
          stroke="rgba(0,0,0,0.2)" 
          strokeWidth={0.5}
        />
      </svg>
    </div>
  );
}

function DragOverlayPiece({ 
  piece, 
  imageUrl, 
  cols, 
  rows, 
  edges, 
  pieceWidth, 
  pieceHeight 
}: {
  piece: ExtendedPuzzlePiece;
  imageUrl: string;
  cols: number;
  rows: number;
  edges: PieceEdges;
  pieceWidth: number;
  pieceHeight: number;
}) {
  const tabSize = 0.2;
  const extraW = pieceWidth * tabSize;
  const extraH = pieceHeight * tabSize;
  const totalWidth = pieceWidth + extraW * 2;
  const totalHeight = pieceHeight + extraH * 2;
  
  const clipId = `overlay-clip-${piece.id}`;
  const path = generatePiecePath(edges, pieceWidth, pieceHeight, tabSize);

  return (
    <div
      className="drop-shadow-xl"
      style={{
        width: totalWidth,
        height: totalHeight,
        transform: 'scale(1.05)',
      }}
    >
      <svg 
        width={totalWidth} 
        height={totalHeight} 
        viewBox={`${-extraW} ${-extraH} ${totalWidth} ${totalHeight}`}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={path} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <image
            href={imageUrl}
            x={-piece.correctCol * pieceWidth}
            y={-piece.correctRow * pieceHeight}
            width={cols * pieceWidth}
            height={rows * pieceHeight}
            preserveAspectRatio="none"
          />
        </g>
        <path 
          d={path} 
          fill="none" 
          stroke="rgba(139, 92, 246, 0.8)" 
          strokeWidth={2}
        />
      </svg>
    </div>
  );
}

export function PuzzleGame({ puzzle }: PuzzleGameProps) {
  const [currentCut, setCurrentCut] = useState<PuzzleCut>(() => getDefaultCut(puzzle.gridSize));
  const [pieces, setPieces] = useState<ExtendedPuzzlePiece[]>([]);
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
  const boardRef = useRef<HTMLDivElement>(null);
  const [boardSize, setBoardSize] = useState({ width: 400, height: 400 });

  const allEdges = useMemo(() => 
    generateAllPieceEdges(currentCut.rows, currentCut.cols),
    [currentCut.rows, currentCut.cols]
  );

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
      if (boardRef.current) {
        const rect = boardRef.current.getBoundingClientRect();
        setBoardSize({ width: rect.width, height: rect.height });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    const timeout = setTimeout(updateSize, 100);
    return () => {
      window.removeEventListener('resize', updateSize);
      clearTimeout(timeout);
    };
  }, [currentCut]);

  const checkCompletion = useCallback((updatedPieces: ExtendedPuzzlePiece[]) => {
    const allPlaced = updatedPieces.every(p => p.isPlaced);
    if (allPlaced) {
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
    
    if (!overId.startsWith('slot-')) return;
    
    const [, targetRowStr, targetColStr] = overId.split('-');
    const targetRow = parseInt(targetRowStr);
    const targetCol = parseInt(targetColStr);

    setPieces(prevPieces => {
      const draggedPiece = prevPieces.find(p => p.id === draggedPieceId);
      if (!draggedPiece) return prevPieces;
      
      if (draggedPiece.correctRow !== targetRow || draggedPiece.correctCol !== targetCol) {
        return prevPieces;
      }
      
      const slotOccupied = prevPieces.some(p => p.isPlaced && p.currentRow === targetRow && p.currentCol === targetCol);
      if (slotOccupied) return prevPieces;

      const updatedPieces = prevPieces.map(p => {
        if (p.id === draggedPieceId) {
          return { 
            ...p, 
            currentRow: targetRow, 
            currentCol: targetCol, 
            isPlaced: true,
            isInTray: false,
          };
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
  };

  const handleAutoSolve = () => {
    const solvedPieces = pieces.map(p => ({
      ...p,
      currentRow: p.correctRow,
      currentCol: p.correctCol,
      isPlaced: true,
      isInTray: false,
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

  const placedCount = pieces.filter(p => p.isPlaced).length;
  const progress = pieces.length > 0 ? (placedCount / pieces.length) * 100 : 0;

  const imageAspectRatio = imageDimensions.width / imageDimensions.height;
  
  const getMaxWidth = () => {
    const pieceCount = currentCut.pieces;
    if (pieceCount <= 25) return 400;
    if (pieceCount <= 50) return 450;
    if (pieceCount <= 100) return 500;
    if (pieceCount <= 150) return 550;
    return 600;
  };
  const maxBoardWidth = getMaxWidth();

  const pieceWidth = boardSize.width / currentCut.cols;
  const pieceHeight = boardSize.height / currentCut.rows;
  
  const trayPieceScale = Math.min(0.8, 60 / Math.max(pieceWidth, pieceHeight));

  const activePiece = activePieceId !== null ? pieces.find(p => p.id === activePieceId) : null;
  const trayPieces = pieces.filter(p => p.isInTray && !p.isPlaced).sort((a, b) => a.trayIndex - b.trayIndex);

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
              {placedCount}/{pieces.length} placed
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

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-col xl:flex-row gap-4 items-start">
            <Card
              className="relative flex-shrink-0 overflow-visible bg-muted/30 p-4"
              data-testid="puzzle-board"
            >
              {showHint && (
                <img
                  src={puzzle.imageUrl}
                  alt="Hint"
                  className="absolute z-10 opacity-30 pointer-events-none rounded"
                  style={{
                    left: pieceWidth * 0.2 + 16,
                    top: pieceHeight * 0.2 + 16,
                    width: boardSize.width,
                    height: boardSize.height,
                  }}
                  data-testid="hint-overlay"
                />
              )}
              <div
                ref={boardRef}
                className="relative border-2 border-border rounded-lg overflow-hidden bg-muted/20"
                style={{ 
                  width: maxBoardWidth,
                  aspectRatio: imageAspectRatio,
                }}
                data-testid="puzzle-grid"
              >
                {Array.from({ length: currentCut.rows }).map((_, row) => (
                  <div key={row} className="flex">
                    {Array.from({ length: currentCut.cols }).map((_, col) => {
                      const edges = allEdges[row]?.[col];
                      if (!edges) return null;
                      
                      const placedPiece = pieces.find(p => p.isPlaced && p.currentRow === row && p.currentCol === col);
                      const isCorrectSlot = activePiece ? (activePiece.correctRow === row && activePiece.correctCol === col) : false;
                      
                      return (
                        <BoardSlot
                          key={`${row}-${col}`}
                          row={row}
                          col={col}
                          pieceWidth={pieceWidth}
                          pieceHeight={pieceHeight}
                          edges={edges}
                          hasPiece={!!placedPiece}
                          isCorrectSlot={isCorrectSlot}
                        >
                          {placedPiece && (
                            <PlacedPiece
                              piece={placedPiece}
                              imageUrl={puzzle.imageUrl}
                              cols={currentCut.cols}
                              rows={currentCut.rows}
                              edges={edges}
                              pieceWidth={pieceWidth}
                              pieceHeight={pieceHeight}
                            />
                          )}
                        </BoardSlot>
                      );
                    })}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="flex-1 min-w-[200px] max-w-[400px] p-4 bg-muted/20" data-testid="piece-tray">
              <div className="text-sm font-medium text-muted-foreground mb-3">
                Pieces ({trayPieces.length} remaining)
              </div>
              <div className="flex flex-wrap gap-2 max-h-[500px] overflow-y-auto">
                {trayPieces.map(piece => {
                  const edges = allEdges[piece.correctRow]?.[piece.correctCol];
                  if (!edges) return null;
                  
                  return (
                    <JigsawPiece
                      key={piece.id}
                      piece={piece}
                      imageUrl={puzzle.imageUrl}
                      cols={currentCut.cols}
                      rows={currentCut.rows}
                      edges={edges}
                      pieceWidth={pieceWidth}
                      pieceHeight={pieceHeight}
                      isComplete={isComplete}
                      isDragging={activePieceId === piece.id}
                      scale={trayPieceScale}
                    />
                  );
                })}
              </div>
            </Card>
          </div>

          <DragOverlay dropAnimation={null}>
            {activePiece && allEdges[activePiece.correctRow]?.[activePiece.correctCol] && (
              <DragOverlayPiece
                piece={activePiece}
                imageUrl={puzzle.imageUrl}
                cols={currentCut.cols}
                rows={currentCut.rows}
                edges={allEdges[activePiece.correctRow][activePiece.correctCol]}
                pieceWidth={pieceWidth}
                pieceHeight={pieceHeight}
              />
            )}
          </DragOverlay>
        </DndContext>

        {showReference && (
          <Card className="overflow-hidden p-0 max-w-xs">
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
  );
}
