import { z } from "zod";

export const categories = [
  { id: "dogs", name: "Dogs", icon: "dog", color: "hsl(340, 75%, 55%)" },
  { id: "cats", name: "Cats", icon: "cat", color: "hsl(262, 83%, 58%)" },
  { id: "birds", name: "Birds", icon: "bird", color: "hsl(200, 80%, 55%)" },
  { id: "goats", name: "Goats", icon: "squirrel", color: "hsl(160, 70%, 45%)" },
  { id: "rabbits", name: "Rabbits", icon: "rabbit", color: "hsl(45, 90%, 55%)" },
  { id: "fish", name: "Fish", icon: "fish", color: "hsl(180, 70%, 50%)" },
] as const;

export type CategoryId = typeof categories[number]["id"];

export const categorySchema = z.object({
  id: z.enum(["dogs", "cats", "birds", "goats", "rabbits", "fish"]),
  name: z.string(),
  icon: z.string(),
  color: z.string(),
});

export type Category = z.infer<typeof categorySchema>;

export const puzzleSchema = z.object({
  id: z.string(),
  categoryId: z.enum(["dogs", "cats", "birds", "goats", "rabbits", "fish"]),
  name: z.string(),
  imageUrl: z.string().url(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  gridSize: z.number().min(2).max(6),
});

export type Puzzle = z.infer<typeof puzzleSchema>;

export const insertPuzzleSchema = puzzleSchema.omit({ id: true });
export type InsertPuzzle = z.infer<typeof insertPuzzleSchema>;

export const puzzlePieceSchema = z.object({
  id: z.number(),
  correctRow: z.number(),
  correctCol: z.number(),
  currentRow: z.number(),
  currentCol: z.number(),
  isPlaced: z.boolean(),
});

export type PuzzlePiece = z.infer<typeof puzzlePieceSchema>;

export const gameStateSchema = z.object({
  puzzle: puzzleSchema,
  pieces: z.array(puzzlePieceSchema),
  startTime: z.number(),
  isComplete: z.boolean(),
  moves: z.number(),
});

export type GameState = z.infer<typeof gameStateSchema>;
