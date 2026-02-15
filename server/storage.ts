import type { Puzzle, CategoryId } from "@shared/schema";

export interface IStorage {
  getPuzzlesByCategory(categoryId: CategoryId): Promise<Puzzle[]>;
  getPuzzleById(id: string): Promise<Puzzle | undefined>;
  getAllPuzzles(): Promise<Puzzle[]>;
}

const samplePuzzles: Puzzle[] = [
  // Dogs
  {
    id: "dog-1",
    categoryId: "dogs",
    name: "Golden Retriever",
    imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=600&fit=crop",
    difficulty: "easy",
    gridSize: 3,
  },
  {
    id: "dog-2",
    categoryId: "dogs",
    name: "Husky Portrait",
    imageUrl: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=600&h=600&fit=crop",
    difficulty: "medium",
    gridSize: 4,
  },
  {
    id: "dog-3",
    categoryId: "dogs",
    name: "Playful Puppy",
    imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop",
    difficulty: "hard",
    gridSize: 5,
  },
  {
    id: "dog-4",
    categoryId: "dogs",
    name: "Corgi Smile",
    imageUrl: "https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=600&h=600&fit=crop",
    difficulty: "easy",
    gridSize: 3,
  },
  // Cats
  {
    id: "cat-1",
    categoryId: "cats",
    name: "Orange Tabby",
    imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop",
    difficulty: "easy",
    gridSize: 3,
  },
  {
    id: "cat-2",
    categoryId: "cats",
    name: "Sleepy Kitten",
    imageUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop",
    difficulty: "medium",
    gridSize: 4,
  },
  {
    id: "cat-3",
    categoryId: "cats",
    name: "Persian Beauty",
    imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=600&fit=crop",
    difficulty: "hard",
    gridSize: 5,
  },
  {
    id: "cat-4",
    categoryId: "cats",
    name: "Curious Cat",
    imageUrl: "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&h=600&fit=crop",
    difficulty: "medium",
    gridSize: 4,
  },
  // Birds
  {
    id: "bird-1",
    categoryId: "birds",
    name: "Colorful Parrot",
    imageUrl: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&h=600&fit=crop",
    difficulty: "easy",
    gridSize: 3,
  },
  {
    id: "bird-2",
    categoryId: "birds",
    name: "Owl Eyes",
    imageUrl: "https://images.unsplash.com/photo-1543549790-8b5f4a028cfb?w=600&h=600&fit=crop",
    difficulty: "medium",
    gridSize: 4,
  },
  {
    id: "bird-3",
    categoryId: "birds",
    name: "Blue Jay",
    imageUrl: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&h=600&fit=crop",
    difficulty: "hard",
    gridSize: 5,
  },
  {
    id: "bird-4",
    categoryId: "birds",
    name: "Hummingbird",
    imageUrl: "https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=600&h=600&fit=crop",
    difficulty: "easy",
    gridSize: 3,
  },
  // Goats
  {
    id: "goat-1",
    categoryId: "goats",
    name: "Mountain Goat",
    imageUrl: "https://images.unsplash.com/photo-1524024973431-2ad916746881?w=600&h=600&fit=crop",
    difficulty: "easy",
    gridSize: 3,
  },
  {
    id: "goat-2",
    categoryId: "goats",
    name: "Baby Goat",
    imageUrl: "https://images.unsplash.com/photo-1533318087102-b3ad366ed041?w=600&h=600&fit=crop",
    difficulty: "medium",
    gridSize: 4,
  },
  {
    id: "goat-3",
    categoryId: "goats",
    name: "Baby Goat",
    imageUrl: "/images/baby-goat.jpg",
    difficulty: "hard",
    gridSize: 5,
  },
  // Rabbits
  {
    id: "rabbit-1",
    categoryId: "rabbits",
    name: "Fluffy Bunny",
    imageUrl: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&h=600&fit=crop",
    difficulty: "easy",
    gridSize: 3,
  },
  {
    id: "rabbit-2",
    categoryId: "rabbits",
    name: "White Rabbit",
    imageUrl: "https://images.unsplash.com/photo-1535241749838-299c29c3b7e9?w=600&h=600&fit=crop",
    difficulty: "medium",
    gridSize: 4,
  },
  {
    id: "rabbit-3",
    categoryId: "rabbits",
    name: "Garden Bunny",
    imageUrl: "https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=600&h=600&fit=crop",
    difficulty: "hard",
    gridSize: 5,
  },
  // Fish
  {
    id: "fish-1",
    categoryId: "fish",
    name: "Clownfish",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=600&fit=crop",
    difficulty: "easy",
    gridSize: 3,
  },
  {
    id: "fish-2",
    categoryId: "fish",
    name: "Betta Fish",
    imageUrl: "https://images.unsplash.com/photo-1520990269825-6bbacdfb6b90?w=600&h=600&fit=crop",
    difficulty: "medium",
    gridSize: 4,
  },
  {
    id: "fish-3",
    categoryId: "fish",
    name: "Tropical Fish",
    imageUrl: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600&h=600&fit=crop",
    difficulty: "hard",
    gridSize: 5,
  },
  {
    id: "fish-4",
    categoryId: "fish",
    name: "Goldfish",
    imageUrl: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=600&h=600&fit=crop",
    difficulty: "easy",
    gridSize: 3,
  },
];

export class MemStorage implements IStorage {
  private puzzles: Map<string, Puzzle>;

  constructor() {
    this.puzzles = new Map();
    samplePuzzles.forEach((puzzle) => {
      this.puzzles.set(puzzle.id, puzzle);
    });
  }

  async getPuzzlesByCategory(categoryId: CategoryId): Promise<Puzzle[]> {
    return Array.from(this.puzzles.values()).filter(
      (puzzle) => puzzle.categoryId === categoryId
    );
  }

  async getPuzzleById(id: string): Promise<Puzzle | undefined> {
    return this.puzzles.get(id);
  }

  async getAllPuzzles(): Promise<Puzzle[]> {
    return Array.from(this.puzzles.values());
  }
}

export const storage = new MemStorage();
