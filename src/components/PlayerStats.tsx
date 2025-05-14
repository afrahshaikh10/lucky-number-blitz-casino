
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatCurrency, PlayerData, getWinRate } from "@/lib/gameLogic";

interface PlayerStatsProps {
  players: PlayerData[];
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ players }) => {
  // Sort players by balance (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.balance - a.balance);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Player Statistics</h2>
      <div className="overflow-x-auto">
        <Table className="casino-card">
          <TableHeader>
            <TableRow className="bg-casino-purple/50 text-white">
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="text-center">W/L</TableHead>
              <TableHead className="text-right">Win Rate</TableHead>
              <TableHead className="text-right">Total Won</TableHead>
              <TableHead className="text-right">Total Lost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPlayers.map((player, index) => (
              <TableRow 
                key={player.id} 
                className={
                  !player.isActive 
                    ? "opacity-60 bg-red-950/10" 
                    : "hover:bg-muted/50"
                }
              >
                <TableCell className="font-medium">#{index + 1}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-background overflow-hidden border border-casino-gold/30">
                    {player.avatar ? (
                      <img 
                        src={player.avatar} 
                        alt={player.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-casino-gold">
                        {player.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span>{player.name} {!player.isActive && "(Eliminated)"}</span>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(player.balance)}
                </TableCell>
                <TableCell className="text-center">
                  <span className="text-green-500">{player.wins}</span>
                  /
                  <span className="text-red-500">{player.losses}</span>
                </TableCell>
                <TableCell className="text-right">
                  {getWinRate(player).toFixed(1)}%
                </TableCell>
                <TableCell className="text-right text-green-500">
                  {formatCurrency(player.totalWon)}
                </TableCell>
                <TableCell className="text-right text-red-500">
                  {formatCurrency(player.totalLost)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PlayerStats;
