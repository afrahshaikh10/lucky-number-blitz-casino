
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlayerData, formatCurrency, getWinRate } from "@/lib/gameLogic";
import { cn } from "@/lib/utils";

interface PlayerCardProps {
  player: PlayerData;
  isCurrentPlayer: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isCurrentPlayer }) => {
  return (
    <Card 
      className={cn(
        "casino-card transition-all duration-300 h-full",
        isCurrentPlayer ? "ring-2 ring-casino-gold scale-105" : "opacity-80",
        !player.isActive && "grayscale opacity-50"
      )}
    >
      <CardHeader className={cn(
        "p-3 flex flex-row items-center space-y-0 gap-2", 
        isCurrentPlayer ? "bg-casino-purple" : "bg-muted"
      )}>
        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center overflow-hidden border-2 border-casino-gold/50">
          <div className="text-xl font-bold text-casino-gold">
            {player.avatar ? (
              <img 
                src={player.avatar} 
                alt={player.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              player.name.charAt(0).toUpperCase()
            )}
          </div>
        </div>
        
        <div className="flex-1">
          <h4 className="font-medium leading-none">{player.name}</h4>
          <p className={cn(
            "text-sm",
            player.isActive ? "text-casino-gold" : "text-muted-foreground"
          )}>
            {player.isActive ? "Active" : "Eliminated"}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="p-3">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Balance:</span>
            <span className="font-medium">{formatCurrency(player.balance)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Win Rate:</span>
            <span className="font-medium">{getWinRate(player).toFixed(0)}%</span>
          </div>
          
          <div className="flex justify-between text-xs mt-2">
            <span className="text-green-500">W: {player.wins}</span>
            <span>|</span>
            <span className="text-red-500">L: {player.losses}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;
