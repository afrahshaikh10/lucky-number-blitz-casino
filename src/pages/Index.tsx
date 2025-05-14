
import { useState } from "react";
import PlayerRegistration from "@/components/PlayerRegistration";
import GameBoard from "@/components/GameBoard";
import { PlayerData } from "@/lib/gameLogic";

const Index = () => {
  const [players, setPlayers] = useState<PlayerData[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  const handlePlayersRegistered = (registeredPlayers: PlayerData[]) => {
    setPlayers(registeredPlayers);
    setGameStarted(true);
  };

  const handleGameOver = () => {
    setGameStarted(false);
    setPlayers([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto">
        {!gameStarted ? (
          <PlayerRegistration onPlayersRegistered={handlePlayersRegistered} />
        ) : (
          <GameBoard players={players} onGameOver={handleGameOver} />
        )}
      </div>
    </div>
  );
};

export default Index;
