# Puzzle Pals - Animal Jigsaw Puzzle Game

## Overview
A fun and engaging jigsaw puzzle website where visitors can choose from various animal categories (dogs, cats, birds, goats, rabbits, fish) and solve interactive jigsaw puzzles.

## Current State
MVP complete with:
- Home page with 6 animal category cards
- Category pages showing available puzzles with difficulty levels
- Interactive jigsaw puzzle game with click-to-swap mechanics
- Progress tracking (time, moves, correct pieces)
- Confetti celebration on puzzle completion
- Light/dark theme toggle
- Responsive design

## Project Architecture

### Frontend (client/src/)
- **pages/home.tsx**: Landing page with category cards
- **pages/category.tsx**: Shows puzzles for selected category
- **pages/puzzle.tsx**: Interactive puzzle game page
- **components/puzzle-game.tsx**: Core puzzle logic with grid-based gameplay
- **components/category-card.tsx**: Category selection cards
- **components/puzzle-card.tsx**: Puzzle preview cards
- **components/confetti.tsx**: Victory celebration animation
- **components/theme-toggle.tsx**: Dark/light mode toggle

### Backend (server/)
- **storage.ts**: In-memory storage with sample puzzles for each category
- **routes.ts**: API endpoints for categories and puzzles

### Shared (shared/)
- **schema.ts**: TypeScript types and Zod schemas for Puzzle, Category, etc.

## API Endpoints
- `GET /api/categories` - Returns all animal categories
- `GET /api/puzzles?categoryId=<id>` - Returns puzzles for a category
- `GET /api/puzzles/:id` - Returns a single puzzle by ID

## Puzzle Mechanics
1. Puzzle pieces are displayed in a grid
2. Click a piece to select it (highlighted with purple ring)
3. Click another piece to swap their positions
4. Pieces in correct position show green glow
5. Complete when all pieces are in correct positions

## Design System
- Primary color: Purple (262°)
- Accent color: Pink/Rose (340°)
- Font: Poppins
- Playful, colorful theme with subtle shadows
- Dark mode support

## Recent Changes
- January 2026: Initial MVP with all core features
