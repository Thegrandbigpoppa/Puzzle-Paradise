# Puzzle Pals - Animal Jigsaw Puzzle Game

## Overview
A fun and engaging jigsaw puzzle website where visitors can choose from various animal categories (dogs, cats, birds, goats, rabbits, fish) and solve interactive jigsaw puzzles with authentic jigsaw-shaped pieces.

## Current State
MVP complete with:
- Home page with 6 animal category cards
- Category pages showing available puzzles (no difficulty labels - users choose their own cut)
- Interactive jigsaw puzzle game with authentic interlocking piece shapes
- Piece tray on the right with scattered pieces to drag to the board
- Progress tracking (time, moves, placed pieces)
- Toggleable hint overlay with iOS-style switch
- Confetti celebration on puzzle completion
- Light/dark theme toggle
- Responsive design

## Project Architecture

### Frontend (client/src/)
- **pages/home.tsx**: Landing page with category cards
- **pages/category.tsx**: Shows puzzles for selected category
- **pages/puzzle.tsx**: Interactive puzzle game page
- **components/puzzle-game.tsx**: Core puzzle logic with jigsaw piece rendering
- **components/puzzle-sidebar.tsx**: Sidebar with controls and hint toggle
- **components/puzzle-cut-selector.tsx**: Dialog to select piece count/cut style
- **components/category-card.tsx**: Category selection cards
- **components/puzzle-card.tsx**: Puzzle preview cards (no difficulty labels)
- **components/confetti.tsx**: Victory celebration animation
- **components/theme-toggle.tsx**: Dark/light mode toggle
- **lib/puzzle-piece-shapes.ts**: SVG path generator for jigsaw piece shapes

### Backend (server/)
- **storage.ts**: In-memory storage with sample puzzles for each category
- **routes.ts**: API endpoints for categories and puzzles

### Shared (shared/)
- **schema.ts**: TypeScript types and Zod schemas for Puzzle, Category, PuzzleCut, etc.

## API Endpoints
- `GET /api/categories` - Returns all animal categories
- `GET /api/puzzles?categoryId=<id>` - Returns puzzles for a category
- `GET /api/puzzles/:id` - Returns a single puzzle by ID

## Puzzle Mechanics
1. Puzzle board on the left shows empty jigsaw-shaped slots
2. Piece tray on the right contains shuffled jigsaw pieces
3. Drag pieces from tray to their correct slot on the board
4. Pieces only snap into their CORRECT position (matching row/col)
5. Green highlight when hovering over correct slot, red for wrong slot
6. Complete when all pieces are placed correctly

### Jigsaw Piece Shapes
- Uses SVG clip paths for authentic interlocking tab/notch shapes
- Each edge can be: flat (border), tab (protruding), or blank (indented)
- Adjacent pieces have matching edges (tab fits into blank)
- Generated algorithmically based on piece position

### Drag and Drop
- Uses @dnd-kit/core with closestCenter collision detection
- PointerSensor: 5px distance activation for mouse
- TouchSensor: 100ms delay, 5px tolerance for mobile
- Expanded droppable hitboxes include tab overhangs for accurate placement
- Visual feedback: dragged piece shows at 105% scale with purple border

### Hint System
- iOS-style toggle switch (green when ON, grey when OFF)
- Shows semi-transparent solution overlay on the puzzle board
- Remains visible until user toggles it off

## Design System
- Primary color: Purple (262°)
- Accent color: Pink/Rose (340°)
- Font: Poppins
- Playful, colorful theme with subtle shadows
- Dark mode support

## Recent Changes
- January 2026: Implemented authentic jigsaw piece shapes with SVG clip paths
- January 2026: Added piece tray layout (pieces on right, board on left)
- January 2026: Added green/red slot highlighting for correct/wrong drops
- January 2026: Removed difficulty labels from puzzle cards
- January 2026: Changed hint button to iOS-style toggle switch
- January 2026: Fixed puzzle proportions to respect actual image aspect ratio
- January 2026: Added dynamic canvas sizing based on piece count
- January 2026: Initial MVP with all core features
