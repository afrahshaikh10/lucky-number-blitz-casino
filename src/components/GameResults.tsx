
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface GameResultsProps {
  randomNumber: number | null;
  userGuess: number | null;
  isRolling: boolean;
  onAnimationComplete?: () => void;
}

const GameResults: React.FC<GameResultsProps> = ({
  randomNumber,
  userGuess,
  isRolling,
  onAnimationComplete,
}) => {
  const [showResult, setShowResult] = useState(false);
  const isWin = userGuess === randomNumber;
  
  // Reset and animate when we get a new result
  useEffect(() => {
    if (isRolling) {
      setShowResult(false);
    } else if (randomNumber !== null) {
      const timer = setTimeout(() => {
        setShowResult(true);
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 2000); // Show result after the rolling animation completes
      
      return () => clearTimeout(timer);
    }
  }, [isRolling, randomNumber, onAnimationComplete]);

  // Render placeholder if we don't have a result yet
  if (randomNumber === null && !isRolling) {
    return (
      <div className="h-32 flex items-center justify-center">
        <p className="text-muted-foreground text-center">
          Pick a number and place a bet to play
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-32">
      {/* Rolling animation */}
      {isRolling && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-card rounded-lg border-2 border-casino-gold flex items-center justify-center animate-spin-slow">
            <span className="text-3xl font-bold">?</span>
          </div>
        </div>
      )}
      
      {/* Result display */}
      {!isRolling && randomNumber !== null && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div 
              className={cn(
                "w-20 h-20 mx-auto bg-card rounded-lg border-2 flex items-center justify-center mb-2",
                showResult && (isWin 
                  ? "border-green-500 animate-pulse-win" 
                  : "border-red-500")
              )}
            >
              <span className="text-3xl font-bold">{randomNumber}</span>
            </div>
            
            {showResult && (
              <div className="flex flex-col items-center">
                {isWin ? (
                  <div className="flex items-center text-green-500 font-bold animate-bounce-in">
                    <Check size={20} className="mr-1" />
                    <span>You Won!</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-500 font-bold animate-bounce-in">
                    <X size={20} className="mr-1" />
                    <span>You Lost!</span>
                  </div>
                )}
                {userGuess !== null && (
                  <div className="text-sm text-muted-foreground mt-1">
                    You guessed: {userGuess}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameResults;
