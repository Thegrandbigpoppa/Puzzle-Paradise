import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Scissors, 
  Shuffle, 
  Wand2, 
  RotateCcw, 
  Clock,
  Image as ImageIcon,
  ChevronRight
} from "lucide-react";
type PuzzleCutConfig = { pieces: number; name: string; cols: number; rows: number };

interface PuzzleSidebarProps {
  puzzleName: string;
  puzzleImage: string;
  currentCut: PuzzleCutConfig;
  elapsedTime: string;
  onChangeCut: () => void;
  onShuffle: () => void;
  onAutoSolve: () => void;
  onStartOver: () => void;
  onToggleReference: () => void;
  showReference: boolean;
}

export function PuzzleSidebar({
  puzzleName,
  puzzleImage,
  currentCut,
  elapsedTime,
  onChangeCut,
  onShuffle,
  onAutoSolve,
  onStartOver,
  onToggleReference,
  showReference,
}: PuzzleSidebarProps) {
  return (
    <Card className="w-full lg:w-72 flex-shrink-0 p-0 overflow-hidden">
      <div className="relative">
        <img
          src={puzzleImage}
          alt={puzzleName}
          className="w-full aspect-square object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-lg">{puzzleName}</h3>
          <p className="text-white/80 text-sm">{currentCut.pieces} Piece {currentCut.name}</p>
        </div>
      </div>
      
      <div className="p-4 space-y-1">
        <SidebarButton 
          icon={<Scissors className="h-4 w-4" />}
          label="Change Cut"
          onClick={onChangeCut}
          highlight
          testId="button-change-cut"
        />
        <SidebarButton 
          icon={<Shuffle className="h-4 w-4" />}
          label="Shuffle Pieces"
          onClick={onShuffle}
          testId="button-shuffle"
        />
        <SidebarButton 
          icon={<Wand2 className="h-4 w-4" />}
          label="Auto Solve"
          onClick={onAutoSolve}
          testId="button-auto-solve"
        />
        <SidebarButton 
          icon={<RotateCcw className="h-4 w-4" />}
          label="Start Over"
          onClick={onStartOver}
          testId="button-start-over"
        />
        <SidebarButton 
          icon={<ImageIcon className="h-4 w-4" />}
          label={showReference ? "Hide Reference" : "Show Reference"}
          onClick={onToggleReference}
          testId="button-toggle-reference-sidebar"
        />
      </div>

      <Separator />
      
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <span className="text-2xl font-mono font-bold">{elapsedTime}</span>
        </div>
      </div>
    </Card>
  );
}

interface SidebarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  highlight?: boolean;
  testId: string;
}

function SidebarButton({ icon, label, onClick, highlight, testId }: SidebarButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={`w-full justify-start gap-3 h-10 ${
        highlight ? "text-primary font-semibold" : ""
      }`}
      data-testid={testId}
    >
      {icon}
      <span className="flex-1 text-left">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </Button>
  );
}
