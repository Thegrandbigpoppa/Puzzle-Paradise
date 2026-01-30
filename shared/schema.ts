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

export interface PuzzleCut {
  pieces: number;
  name: string;
  cols: number;
  rows: number;
}

export const puzzleCutOptions: PuzzleCut[] = [
  { pieces: 6, name: "6 pieces", cols: 3, rows: 2 },
  { pieces: 9, name: "9 pieces", cols: 3, rows: 3 },
  { pieces: 12, name: "12 pieces", cols: 4, rows: 3 },
  { pieces: 16, name: "16 pieces", cols: 4, rows: 4 },
  { pieces: 20, name: "20 pieces", cols: 5, rows: 4 },
  { pieces: 25, name: "25 pieces", cols: 5, rows: 5 },
  { pieces: 30, name: "30 pieces", cols: 6, rows: 5 },
  { pieces: 35, name: "35 pieces", cols: 7, rows: 5 },
  { pieces: 36, name: "36 pieces", cols: 6, rows: 6 },
  { pieces: 40, name: "40 pieces", cols: 8, rows: 5 },
  { pieces: 42, name: "42 pieces", cols: 7, rows: 6 },
  { pieces: 48, name: "48 pieces", cols: 8, rows: 6 },
  { pieces: 49, name: "49 pieces", cols: 7, rows: 7 },
  { pieces: 56, name: "56 pieces", cols: 8, rows: 7 },
  { pieces: 63, name: "63 pieces", cols: 9, rows: 7 },
  { pieces: 64, name: "64 pieces", cols: 8, rows: 8 },
  { pieces: 70, name: "70 pieces", cols: 10, rows: 7 },
  { pieces: 72, name: "72 pieces", cols: 9, rows: 8 },
  { pieces: 80, name: "80 pieces", cols: 10, rows: 8 },
  { pieces: 81, name: "81 pieces", cols: 9, rows: 9 },
  { pieces: 90, name: "90 pieces", cols: 10, rows: 9 },
  { pieces: 96, name: "96 pieces", cols: 12, rows: 8 },
  { pieces: 100, name: "100 pieces", cols: 10, rows: 10 },
  { pieces: 108, name: "108 pieces", cols: 12, rows: 9 },
  { pieces: 120, name: "120 pieces", cols: 12, rows: 10 },
  { pieces: 130, name: "130 pieces", cols: 13, rows: 10 },
  { pieces: 144, name: "144 pieces", cols: 12, rows: 12 },
  { pieces: 154, name: "154 pieces", cols: 14, rows: 11 },
  { pieces: 168, name: "168 pieces", cols: 14, rows: 12 },
  { pieces: 180, name: "180 pieces", cols: 15, rows: 12 },
  { pieces: 196, name: "196 pieces", cols: 14, rows: 14 },
  { pieces: 210, name: "210 pieces", cols: 15, rows: 14 },
  { pieces: 224, name: "224 pieces", cols: 16, rows: 14 },
  { pieces: 240, name: "240 pieces", cols: 16, rows: 15 },
  { pieces: 247, name: "247 pieces", cols: 19, rows: 13 },
];
