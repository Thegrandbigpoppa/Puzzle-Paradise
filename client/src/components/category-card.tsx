import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Dog, Cat, Bird, Squirrel, Rabbit, Fish, type LucideIcon } from "lucide-react";
import type { Category } from "@shared/schema";

const iconMap: Record<string, LucideIcon> = {
  dog: Dog,
  cat: Cat,
  bird: Bird,
  squirrel: Squirrel,
  rabbit: Rabbit,
  fish: Fish,
};

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Dog;
  
  return (
    <Link href={`/category/${category.id}`}>
      <Card
        className="group cursor-pointer overflow-visible p-6 transition-all duration-300 hover:scale-[1.02] hover-elevate"
        data-testid={`card-category-${category.id}`}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: category.color }}
          >
            <Icon className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold">{category.name}</h3>
          <p className="text-sm text-muted-foreground">
            Click to explore puzzles
          </p>
        </div>
      </Card>
    </Link>
  );
}
