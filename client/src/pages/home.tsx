import { categories } from "@shared/schema";
import { CategoryCard } from "@/components/category-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Puzzle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Puzzle className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Puzzle Pals</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Choose Your Adventure
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Select an animal category and start solving beautiful jigsaw puzzles. 
            Perfect for relaxation and fun!
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="mb-4 text-2xl font-semibold">Why Play Puzzle Pals?</h2>
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
            <div className="rounded-lg bg-card p-6">
              <div className="mb-3 text-3xl">
                <Puzzle className="mx-auto h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Multiple Difficulties</h3>
              <p className="text-sm text-muted-foreground">
                Choose from easy to hard puzzles based on your skill level
              </p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <div className="mb-3 text-3xl">
                <Puzzle className="mx-auto h-8 w-8 text-accent" />
              </div>
              <h3 className="mb-2 font-semibold">Beautiful Images</h3>
              <p className="text-sm text-muted-foreground">
                High-quality animal photos that are a joy to piece together
              </p>
            </div>
            <div className="rounded-lg bg-card p-6">
              <div className="mb-3 text-3xl">
                <Puzzle className="mx-auto h-8 w-8 text-chart-3" />
              </div>
              <h3 className="mb-2 font-semibold">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                See your time and moves as you solve each puzzle
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Made with love for puzzle enthusiasts everywhere
        </div>
      </footer>
    </div>
  );
}
