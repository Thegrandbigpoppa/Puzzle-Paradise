import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import type { Puzzle } from "@shared/schema";
import { PuzzleGame } from "@/components/puzzle-game";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Puzzle as PuzzleIcon } from "lucide-react";

const difficultyColors = {
  easy: "bg-green-500/10 text-green-600 dark:text-green-400",
  medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  hard: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export default function PuzzlePage() {
  const [, params] = useRoute("/puzzle/:id");
  const puzzleId = params?.id;

  const { data: puzzle, isLoading, error } = useQuery<Puzzle>({
    queryKey: [`/api/puzzles/${puzzleId}`],
    enabled: !!puzzleId,
  });

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <PuzzleIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Puzzle not found</h1>
          <p className="mt-2 text-muted-foreground">
            This puzzle may have been removed or doesn't exist.
          </p>
          <Link href="/">
            <Button className="mt-4" data-testid="button-go-home">
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            {puzzle && (
              <Link href={`/category/${puzzle.categoryId}`}>
                <Button variant="ghost" size="icon" data-testid="button-back-category">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <PuzzleIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            {isLoading ? (
              <Skeleton className="h-7 w-32" />
            ) : (
              <span className="text-xl font-bold">{puzzle?.name}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {puzzle && (
              <Badge variant="secondary" className={difficultyColors[puzzle.difficulty]}>
                {puzzle.difficulty}
              </Badge>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-2 w-full" />
            <Skeleton className="aspect-square max-w-lg" />
          </div>
        )}

        {puzzle && <PuzzleGame puzzle={puzzle} />}
      </main>
    </div>
  );
}
