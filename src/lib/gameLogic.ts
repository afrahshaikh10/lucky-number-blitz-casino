
import { toast } from "sonner";

export interface PlayerData {
  id: string;
  name: string;
  balance: number;
  wins: number;
  losses: number;
  totalWon: number;
  totalLost: number;
  isActive: boolean;
  avatar?: string;
}

export interface GameState {
  players: PlayerData[];
  currentPlayerIndex: number;
  randomNumber: number | null;
  isRolling: boolean;
  gameStatus: 'registration' | 'betting' | 'rolling' | 'result' | 'gameOver';
  roundNumber: number;
}

export const createNewPlayer = (name: string, initialBalance: number): PlayerData => {
  return {
    id: generateId(),
    name,
    balance: initialBalance,
    wins: 0,
    losses: 0,
    totalWon: 0,
    totalLost: 0,
    isActive: true,
    avatar: `/images/avatar-${Math.floor(Math.random() * 8) + 1}.png`
  };
};

export const generateRandomNumber = (): number => {
  return Math.floor(Math.random() * 10) + 1;
};

export const processPlayerBet = (
  player: PlayerData,
  betAmount: number,
  userGuess: number,
  actualNumber: number
): PlayerData => {
  const updatedPlayer = { ...player };
  
  if (userGuess === actualNumber) {
    // Player wins (10x the bet)
    const winAmount = betAmount * 10;
    updatedPlayer.balance += winAmount;
    updatedPlayer.wins += 1;
    updatedPlayer.totalWon += winAmount;
    toast.success(`${player.name} won $${winAmount.toFixed(2)}!`);
  } else {
    // Player loses
    updatedPlayer.balance -= betAmount;
    updatedPlayer.losses += 1;
    updatedPlayer.totalLost += betAmount;
    toast.error(`${player.name} lost $${betAmount.toFixed(2)}`);
    
    // Check if player is eliminated
    if (updatedPlayer.balance <= 0) {
      updatedPlayer.isActive = false;
      toast.error(`${player.name} has been eliminated!`);
    }
  }
  
  return updatedPlayer;
};

export const checkGameOver = (players: PlayerData[]): boolean => {
  return !players.some(player => player.isActive);
};

export const getWinRate = (player: PlayerData): number => {
  const totalGames = player.wins + player.losses;
  return totalGames === 0 ? 0 : (player.wins / totalGames) * 100;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  }).format(amount);
};

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};
