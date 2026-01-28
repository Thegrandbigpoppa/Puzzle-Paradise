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

export const puzzleCutOptions = [
  { pieces: 6, name: "Classic", cols: 3, rows: 2 },
  { pieces: 12, name: "ZigZag", cols: 4, rows: 3 },
  { pieces: 16, name: "Blocks", cols: 4, rows: 4 },
  { pieces: 20, name: "Classic", cols: 5, rows: 4 },
  { pieces: 20, name: "Birds", cols: 5, rows: 4 },
  { pieces: 22, name: "Wavy", cols: 11, rows: 2 },
  { pieces: 22, name: "Polygons", cols: 11, rows: 2 },
  { pieces: 32, name: "Round", cols: 8, rows: 4 },
  { pieces: 35, name: "Jigzone", cols: 7, rows: 5 },
  { pieces: 40, name: "Birds", cols: 8, rows: 5 },
  { pieces: 41, name: "Tetris", cols: 41, rows: 1 },
  { pieces: 44, name: "Tri-Dove", cols: 11, rows: 4 },
  { pieces: 48, name: "Classic", cols: 8, rows: 6 },
  { pieces: 48, name: "Euros", cols: 8, rows: 6 },
  { pieces: 48, name: "USA", cols: 8, rows: 6 },
  { pieces: 50, name: "Circles", cols: 10, rows: 5 },
  { pieces: 50, name: "Tri-Clip", cols: 10, rows: 5 },
  { pieces: 51, name: "Crazy", cols: 17, rows: 3 },
  { pieces: 55, name: "Sixstar", cols: 11, rows: 5 },
  { pieces: 62, name: "Tetris", cols: 31, rows: 2 },
  { pieces: 67, name: "Classic", cols: 67, rows: 1 },
  { pieces: 70, name: "Bulbs", cols: 10, rows: 7 },
  { pieces: 79, name: "Stars", cols: 79, rows: 1 },
  { pieces: 79, name: "Bricks", cols: 79, rows: 1 },
  { pieces: 80, name: "Classic", cols: 10, rows: 8 },
  { pieces: 87, name: "Crazy", cols: 29, rows: 3 },
  { pieces: 91, name: "Lizards", cols: 13, rows: 7 },
  { pieces: 96, name: "Triangles", cols: 12, rows: 8 },
  { pieces: 100, name: "Classic", cols: 10, rows: 10 },
  { pieces: 108, name: "Swirls", cols: 12, rows: 9 },
  { pieces: 154, name: "Classic", cols: 14, rows: 11 },
  { pieces: 184, name: "Crazy", cols: 23, rows: 8 },
  { pieces: 240, name: "Classic", cols: 16, rows: 15 },
  { pieces: 240, name: "Squares", cols: 16, rows: 15 },
  { pieces: 247, name: "Triangles", cols: 19, rows: 13 },
] as const;

export type PuzzleCut = typeof puzzleCutOptions[number];
