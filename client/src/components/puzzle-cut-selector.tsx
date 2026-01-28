import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { puzzleCutOptions, type PuzzleCut } from "@shared/schema";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PuzzleCutSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCut: PuzzleCut;
  onSelectCut: (cut: PuzzleCut) => void;
}

export function PuzzleCutSelector({ 
  open, 
  onOpenChange, 
  currentCut, 
  onSelectCut 
}: PuzzleCutSelectorProps) {
  const groupedCuts = puzzleCutOptions.reduce((acc, cut) => {
    const group = cut.pieces <= 25 ? "Easy (6-25)" : 
                  cut.pieces <= 50 ? "Medium (26-50)" : 
                  cut.pieces <= 100 ? "Hard (51-100)" : "Expert (100+)";
    if (!acc[group]) acc[group] = [];
    acc[group].push(cut);
    return acc;
  }, {} as Record<string, PuzzleCut[]>);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">Choose a puzzle cut</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            {Object.entries(groupedCuts).map(([group, cuts]) => (
              <div key={group}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">{group}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {cuts.map((cut, index) => {
                    const isSelected = currentCut.pieces === cut.pieces && currentCut.name === cut.name;
                    return (
                      <button
                        key={`${cut.pieces}-${cut.name}-${index}`}
                        onClick={() => {
                          onSelectCut(cut);
                          onOpenChange(false);
                        }}
                        className={`flex items-center gap-2 p-3 rounded-lg text-left transition-all hover-elevate ${
                          isSelected 
                            ? "bg-primary/10 ring-2 ring-primary" 
                            : "bg-card hover:bg-accent/10"
                        }`}
                        data-testid={`cut-option-${cut.pieces}-${cut.name}`}
                      >
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          isSelected ? "bg-primary" : "bg-muted-foreground/30"
                        }`} />
                        <span className="text-sm font-medium">
                          {cut.pieces} Piece {cut.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
