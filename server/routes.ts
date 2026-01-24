import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { categories, type CategoryId } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Get all categories
  app.get("/api/categories", async (_req, res) => {
    res.json(categories);
  });

  // Get puzzles by category
  app.get("/api/puzzles", async (req, res) => {
    const categoryId = req.query.categoryId as CategoryId | undefined;
    
    if (categoryId) {
      const validCategory = categories.find(c => c.id === categoryId);
      if (!validCategory) {
        return res.status(400).json({ error: "Invalid category" });
      }
      const puzzles = await storage.getPuzzlesByCategory(categoryId);
      return res.json(puzzles);
    }
    
    const puzzles = await storage.getAllPuzzles();
    res.json(puzzles);
  });

  // Get single puzzle by ID
  app.get("/api/puzzles/:id", async (req, res) => {
    const puzzle = await storage.getPuzzleById(req.params.id);
    
    if (!puzzle) {
      return res.status(404).json({ error: "Puzzle not found" });
    }
    
    res.json(puzzle);
  });

  return httpServer;
}
