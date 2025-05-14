
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  GameState, 
  PlayerData, 
  processPlayerBet,
  generateRandomNumber, 
  checkGameOver,
  formatCurrency
} from "@/lib/gameLogic";
import PlayerCard from "./PlayerCard";
import NumberSelector from "./NumberSelector";
import BettingControls from "./BettingControls";
import GameResults from "./GameResults";
import PlayerStats from "./PlayerStats";
import { toast } from "sonner";
import { Coins, RefreshCw, User } from "lucide-react";

interface GameBoardProps {
  players: PlayerData[];
  onGameOver: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ players: initialPlayers, onGameOver }) => {
  const [gameState, setGameState] = useState<GameState>({
    players: initialPlayers,
    currentPlayerIndex: 0,
    randomNumber: null,
    isRolling: false,
    gameStatus: "betting",
    roundNumber: 1,
  });

  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [currentBet, setCurrentBet] = useState<number>(0);
  const [showStats, setShowStats] = useState<boolean>(false);

  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  // Start a new game
  const resetGame = () => {
    setGameState({
      ...gameState,
      currentPlayerIndex: 0,
      randomNumber: null,
      isRolling: false,
      gameStatus: "betting",
      roundNumber: 1,
    });
    setSelectedNumber(null);
    setCurrentBet(0);
  };

  // Handle number selection
  const handleSelectNumber = (num: number) => {
    setSelectedNumber(num);
  };

  // Handle bet placement
  const handlePlaceBet = (amount: number) => {
    if (selectedNumber === null) {
      toast.error("Please select a number first");
      return;
    }

    if (amount <= 0 || amount > currentPlayer.balance) {
      toast.error("Invalid bet amount");
      return;
    }

    setCurrentBet(amount);
    setGameState({ ...gameState, gameStatus: "rolling", isRolling: true });

    // Simulate rolling dice
    setTimeout(() => {
      const randomNumber = generateRandomNumber();
      setGameState({
        ...gameState,
        randomNumber,
        isRolling: false,
      });
    }, 1500);
  };

  // Process the result after animation completes
  const handleResultAnimationComplete = () => {
    if (gameState.randomNumber === null || selectedNumber === null) return;

    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.currentPlayerIndex] = processPlayerBet(
      currentPlayer,
      currentBet,
      selectedNumber,
      gameState.randomNumber
    );

    // Check if game is over
    const isGameOver = checkGameOver(updatedPlayers);

    // Move to next player or round
    let nextPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    let nextRound = gameState.roundNumber;

    // Skip eliminated players and find the next active player
    while (!isGameOver && !updatedPlayers[nextPlayerIndex].isActive) {
      nextPlayerIndex = (nextPlayerIndex + 1) % gameState.players.length;
      if (nextPlayerIndex === 0) {
        nextRound++;
      }
    }

    if (nextPlayerIndex === 0 && !isGameOver) {
      nextRound++;
    }

    setGameState({
      players: updatedPlayers,
      currentPlayerIndex: nextPlayerIndex,
      randomNumber: null,
      isRolling: false,
      gameStatus: isGameOver ? "gameOver" : "betting",
      roundNumber: nextRound,
    });
    
    setSelectedNumber(null);
    setCurrentBet(0);
    
    if (isGameOver) {
      toast.success("Game Over! Check final statistics.");
    }
  };

  // Handle end game
  const handleEndGame = () => {
    onGameOver();
  };

  // Toggle stats view
  const toggleStats = () => {
    setShowStats(!showStats);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        {/* Game area */}
        <div className="w-full lg:w-2/3 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-3xl font-bold text-casino-gold">
              Lucky Number Blitz
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Round {gameState.roundNumber}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleStats}
                className="ml-2"
              >
                {showStats ? "Hide Stats" : "Show Stats"}
              </Button>
            </div>
          </div>

          {showStats ? (
            <PlayerStats players={gameState.players} />
          ) : (
            <Card className="casino-card overflow-hidden">
              <CardHeader className="bg-casino-purple/50 border-b border-casino-gold/20">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <User size={18} className="mr-2" />
                    {currentPlayer.name}'s Turn
                  </CardTitle>
                  <div className="text-casino-gold font-bold flex items-center">
                    <Coins size={18} className="mr-1" />
                    {formatCurrency(currentPlayer.balance)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <GameResults
                      randomNumber={gameState.randomNumber}
                      userGuess={selectedNumber}
                      isRolling={gameState.isRolling}
                      onAnimationComplete={handleResultAnimationComplete}
                    />

                    <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                      <NumberSelector
                        selectedNumber={selectedNumber}
                        onSelectNumber={handleSelectNumber}
                        disabled={gameState.gameStatus !== "betting" || gameState.isRolling}
                      />
                    </div>

                    <div className="mt-4">
                      <BettingControls
                        maxBet={currentPlayer.balance}
                        onPlaceBet={handlePlaceBet}
                        disabled={
                          gameState.gameStatus !== "betting" ||
                          gameState.isRolling ||
                          selectedNumber === null
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Instructions:</h3>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>1. Select a number between 1-10</p>
                      <p>2. Place your bet</p>
                      <p>3. If your number matches, you win 10x your bet!</p>
                      <p>4. Players with no money are eliminated</p>
                    </div>
                  </div>
                </div>

                {gameState.gameStatus === "gameOver" && (
                  <div className="mt-6 p-4 bg-casino-purple/30 rounded-lg text-center">
                    <h2 className="text-2xl font-bold text-casino-gold mb-2">
                      Game Over!
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      All players have been eliminated or the game has ended.
                    </p>
                    <div className="flex justify-center gap-3">
                      <Button variant="default" onClick={handleEndGame}>
                        New Game
                      </Button>
                      <Button variant="outline" onClick={() => setShowStats(true)}>
                        View Final Stats
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Players sidebar */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-4">
            <h2 className="text-xl font-bold mb-4">Players</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {gameState.players.map((player, index) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  isCurrentPlayer={index === gameState.currentPlayerIndex}
                />
              ))}
            </div>

            {!showStats && (
              <Button 
                variant="outline" 
                className="w-full mt-4 flex items-center justify-center"
                onClick={toggleStats}
              >
                <RefreshCw size={16} className="mr-2" />
                View Stats
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
