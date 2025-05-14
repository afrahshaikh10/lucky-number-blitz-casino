
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayerData, createNewPlayer } from "@/lib/gameLogic";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

interface PlayerRegistrationProps {
  onPlayersRegistered: (players: PlayerData[]) => void;
}

const PlayerRegistration: React.FC<PlayerRegistrationProps> = ({ onPlayersRegistered }) => {
  const [players, setPlayers] = useState<{ name: string; balance: string }[]>([
    { name: "", balance: "" },
  ]);

  const handleAddPlayer = () => {
    if (players.length < 6) {
      setPlayers([...players, { name: "", balance: "" }]);
    } else {
      toast.error("Maximum 6 players allowed");
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length > 1) {
      const newPlayers = [...players];
      newPlayers.splice(index, 1);
      setPlayers(newPlayers);
    }
  };

  const updatePlayerField = (
    index: number,
    field: "name" | "balance",
    value: string
  ) => {
    const newPlayers = [...players];
    newPlayers[index][field] = value;
    setPlayers(newPlayers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const invalidInputs = players.some(
      (player) => !player.name.trim() || isNaN(parseFloat(player.balance)) || parseFloat(player.balance) <= 0
    );
    
    if (invalidInputs) {
      toast.error("All fields are required and balance must be a positive number");
      return;
    }
    
    // Create player objects
    const registeredPlayers = players.map((player) => 
      createNewPlayer(player.name, parseFloat(player.balance))
    );
    
    onPlayersRegistered(registeredPlayers);
    toast.success("Players registered successfully!");
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8 px-4">
      <Card className="casino-card">
        <CardHeader className="text-center border-b border-casino-gold/30 bg-casino-purple/50">
          <CardTitle className="text-3xl font-bold text-casino-gold">
            Lucky Number Blitz
          </CardTitle>
          <p className="text-secondary">Register Players to Begin</p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {players.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg animate-fade-in"
                >
                  <div className="flex-1">
                    <label className="text-sm text-secondary">Player Name</label>
                    <Input
                      value={player.name}
                      onChange={(e) =>
                        updatePlayerField(index, "name", e.target.value)
                      }
                      placeholder="Enter name"
                      className="bg-background border-casino-light-purple/30"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-secondary">
                      Initial Balance ($)
                    </label>
                    <Input
                      value={player.balance}
                      onChange={(e) =>
                        updatePlayerField(index, "balance", e.target.value)
                      }
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="Enter amount"
                      className="bg-background border-casino-light-purple/30"
                    />
                  </div>
                  {players.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="mt-6"
                      onClick={() => handleRemovePlayer(index)}
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed border-casino-light-purple/50 hover:bg-casino-light-purple/10"
                onClick={handleAddPlayer}
                disabled={players.length >= 6}
              >
                <Plus size={16} className="mr-2" />
                Add Player
              </Button>
            </div>

            <Button 
              type="submit" 
              className="casino-btn mt-6 w-full text-lg"
            >
              Start Game
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-casino-gold/30 text-xs text-muted-foreground">
          <p>Guess correctly and win 10x your bet!</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlayerRegistration;
