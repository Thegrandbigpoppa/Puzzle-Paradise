import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Puzzle as PuzzleIcon } from "lucide-react";
import type { Puzzle } from "@shared/schema";

interface PuzzleCardProps {
  puzzle: Puzzle;
}

export function PuzzleCard({ puzzle }: PuzzleCardProps) {
  return (
    <Link href={`/puzzle/${puzzle.id}`}>
      <Card
        className="group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02] hover-elevate"
        data-testid={`card-puzzle-${puzzle.id}`}
      >
        <div className="aspect-square relative overflow-hidden">
          <img
            src={puzzle.imageUrl}
            alt={puzzle.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="flex items-center gap-2 text-white">
              <PuzzleIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{puzzle.gridSize}x{puzzle.gridSize}</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold line-clamp-1">{puzzle.name}</h3>
        </div>
      </Card>
    </Link>
  );
}
