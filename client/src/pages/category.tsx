import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { categories } from "@shared/schema";
import type { Puzzle } from "@shared/schema";
import { PuzzleCard } from "@/components/puzzle-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Puzzle as PuzzleIcon } from "lucide-react";
import { Dog, Cat, Bird, Squirrel, Rabbit, Fish, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
  squirrel: Squirrel,
  rabbit: Rabbit,
  fish: Fish,
};

export default function CategoryPage() {
  const [, params] = useRoute("/category/:id");
  const categoryId = params?.id;

  const category = categories.find((c) => c.id === categoryId);
  const Icon = category ? iconMap[category.icon] : PuzzleIcon;

  const { data: puzzles, isLoading, error } = useQuery<Puzzle[]>({
    queryKey: [`/api/puzzles?categoryId=${categoryId}`],
    enabled: !!categoryId,
  });

  if (!category) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Category not found</h1>
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
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back-home">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full"
              style={{ backgroundColor: category.color }}
            >
              <Icon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">{category.name} Puzzles</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">{category.name} Puzzles</h1>
          <p className="text-muted-foreground">
            Choose a puzzle to start your adventure!
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-center text-destructive">
            Failed to load puzzles. Please try again later.
          </div>
        )}

        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            ))}
          </div>
        )}

        {puzzles && puzzles.length === 0 && (
          <div className="py-12 text-center">
            <PuzzleIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold">No puzzles yet</h2>
            <p className="mt-2 text-muted-foreground">
              Check back soon for new {category.name.toLowerCase()} puzzles!
            </p>
          </div>
        )}

        {puzzles && puzzles.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {puzzles.map((puzzle) => (
              <PuzzleCard key={puzzle.id} puzzle={puzzle} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
