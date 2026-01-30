import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { puzzleCutOptions } from "@shared/schema";
import { Grid3X3, LayoutGrid, Puzzle } from "lucide-react";

const featuredCuts = [
  puzzleCutOptions.find(c => c.pieces === 6)!,
  puzzleCutOptions.find(c => c.pieces === 16)!,
  puzzleCutOptions.find(c => c.pieces === 35)!,
  puzzleCutOptions.find(c => c.pieces === 64)!,
  puzzleCutOptions.find(c => c.pieces === 100)!,
  puzzleCutOptions.find(c => c.pieces === 247)!,
];

export function PuzzleCutsShowcase() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <LayoutGrid className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Multiple Puzzle Cuts</h3>
          <p className="text-sm text-muted-foreground">From 6 to 247 pieces</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {featuredCuts.map((cut, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="px-3 py-1.5 text-sm"
          >
            <Puzzle className="h-3 w-3 mr-1.5" />
            {cut.name}
          </Badge>
        ))}
        <Badge variant="outline" className="px-3 py-1.5 text-sm text-muted-foreground">
          +{puzzleCutOptions.length - featuredCuts.length} more
        </Badge>
      </div>
      
      <p className="mt-4 text-sm text-muted-foreground">
        Choose your perfect challenge level with over {puzzleCutOptions.length} different puzzle cut options!
      </p>
    </Card>
  );
}
