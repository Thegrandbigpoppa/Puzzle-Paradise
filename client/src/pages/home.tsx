import { categories } from "@shared/schema";
import { CategoryCard } from "@/components/category-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { AnimatedPuzzleDemo } from "@/components/animated-puzzle-demo";
import { PuzzleCutsShowcase } from "@/components/puzzle-cuts-showcase";
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
            <span className="text-xl font-bold">The Jig Zone</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Choose Your Adventure
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10">
            Select an animal category and start solving beautiful jigsaw puzzles. 
            Perfect for relaxation and fun!
          </p>
          <AnimatedPuzzleDemo />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold text-center">Why Play The Jig Zone?</h2>
          <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
            <PuzzleCutsShowcase />
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg bg-card p-5">
                <div className="mb-3">
                  <Puzzle className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-1.5 font-semibold">Multiple Difficulties</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from easy to hard puzzles based on your skill level
                </p>
              </div>
              <div className="rounded-lg bg-card p-5">
                <div className="mb-3">
                  <Puzzle className="h-7 w-7 text-accent" />
                </div>
                <h3 className="mb-1.5 font-semibold">Beautiful Images</h3>
                <p className="text-sm text-muted-foreground">
                  High-quality animal photos that are a joy to piece together
                </p>
              </div>
              <div className="rounded-lg bg-card p-5 sm:col-span-2">
                <div className="mb-3">
                  <Puzzle className="h-7 w-7 text-chart-3" />
                </div>
                <h3 className="mb-1.5 font-semibold">Track Progress</h3>
                <p className="text-sm text-muted-foreground">
                  See your time and moves as you solve each puzzle
                </p>
              </div>
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
