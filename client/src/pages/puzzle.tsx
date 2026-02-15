import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import type { Puzzle } from "@shared/schema";
import { PuzzleGame } from "@/components/puzzle-game";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Puzzle as PuzzleIcon, Home } from "lucide-react";

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
        <div className="container mx-auto flex h-14 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2">
            {puzzle && (
              <Link href={`/category/${puzzle.categoryId}`}>
                <Button variant="ghost" size="icon" data-testid="button-back-category">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            )}
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-home">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <PuzzleIcon className="h-4 w-4 text-primary-foreground" />
            </div>
            {isLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <span className="text-lg font-bold">The Jig Zone</span>
            )}
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {isLoading && (
          <div className="flex gap-6">
            <Skeleton className="h-96 w-72" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="aspect-square max-w-lg" />
            </div>
          </div>
        )}

        {puzzle && <PuzzleGame puzzle={puzzle} />}
      </main>
    </div>
  );
}
