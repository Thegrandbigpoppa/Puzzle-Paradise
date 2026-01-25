import { useState, useEffect } from "react";

const demoImages = [
  "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1524024973431-2ad916746881?w=400&h=400&fit=crop",
];

const gridSize = 3;
const totalPieces = gridSize * gridSize;

interface PieceState {
  id: number;
  row: number;
  col: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
  scale: number;
  opacity: number;
}

function generateScatteredPositions(): PieceState[] {
  const pieces: PieceState[] = [];
  for (let i = 0; i < totalPieces; i++) {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    pieces.push({
      id: i,
      row,
      col,
      offsetX: (Math.random() - 0.5) * 300,
      offsetY: (Math.random() - 0.5) * 200,
      rotation: (Math.random() - 0.5) * 60,
      scale: 0.8 + Math.random() * 0.3,
      opacity: 0.7 + Math.random() * 0.3,
    });
  }
  return pieces;
}

function generateAssembledPositions(): PieceState[] {
  const pieces: PieceState[] = [];
  for (let i = 0; i < totalPieces; i++) {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    pieces.push({
      id: i,
      row,
      col,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
    });
  }
  return pieces;
}

export function AnimatedPuzzleDemo() {
  const [imageIndex, setImageIndex] = useState(0);
  const [pieces, setPieces] = useState<PieceState[]>(generateScatteredPositions);
  const [isAssembled, setIsAssembled] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const cycleAnimation = () => {
      if (!isAssembled) {
        setPieces(generateAssembledPositions());
        setIsAssembled(true);
        setIsTransitioning(true);
        
        setTimeout(() => {
          setIsTransitioning(false);
        }, 1500);
        
        setTimeout(() => {
          setPieces(generateScatteredPositions());
          setIsAssembled(false);
          setIsTransitioning(true);
          
          setTimeout(() => {
            setIsTransitioning(false);
            setImageIndex((prev) => (prev + 1) % demoImages.length);
          }, 1500);
        }, 3000);
      }
    };

    cycleAnimation();
    const interval = setInterval(cycleAnimation, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentImage = demoImages[imageIndex];
  const pieceSize = 100 / gridSize;

  return (
    <div className="relative mx-auto w-full max-w-sm aspect-square">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/20 blur-xl" />
      
      <div className="relative rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 p-4 overflow-visible">
        <div className="relative aspect-square">
          {pieces.map((piece) => (
            <div
              key={piece.id}
              className="absolute transition-all duration-[1500ms] ease-out"
              style={{
                width: `${pieceSize}%`,
                height: `${pieceSize}%`,
                left: `${piece.col * pieceSize}%`,
                top: `${piece.row * pieceSize}%`,
                transform: `translate(${piece.offsetX}px, ${piece.offsetY}px) rotate(${piece.rotation}deg) scale(${piece.scale})`,
                opacity: piece.opacity,
                zIndex: isAssembled ? 1 : 10 - piece.id,
              }}
            >
              <div
                className="w-full h-full rounded-md overflow-hidden shadow-lg"
                style={{
                  backgroundImage: `url(${currentImage})`,
                  backgroundSize: `${gridSize * 100}%`,
                  backgroundPosition: `${(piece.col / (gridSize - 1)) * 100}% ${(piece.row / (gridSize - 1)) * 100}%`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {demoImages.map((_, idx) => (
          <div
            key={idx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === imageIndex
                ? "w-6 bg-primary"
                : "w-1.5 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
