import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
}

export default function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const colors = [
      "hsl(262, 83%, 58%)",
      "hsl(340, 75%, 55%)",
      "hsl(200, 80%, 55%)",
      "hsl(160, 70%, 45%)",
      "hsl(45, 90%, 55%)",
      "hsl(0, 0%, 100%)",
    ];

    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < 100; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        size: 8 + Math.random() * 8,
      });
    }
    setPieces(newPieces);

    const timeout = setTimeout(() => setPieces([]), 4000);
    return () => clearTimeout(timeout);
  }, []);

  if (pieces.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-fall"
          style={{
            left: `${piece.x}%`,
            top: "-20px",
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
}
