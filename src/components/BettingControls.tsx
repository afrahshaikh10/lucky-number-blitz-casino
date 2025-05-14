
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/gameLogic";
import { DollarSign } from "lucide-react";

interface BettingControlsProps {
  maxBet: number;
  onPlaceBet: (amount: number) => void;
  disabled?: boolean;
}

const BettingControls: React.FC<BettingControlsProps> = ({
  maxBet,
  onPlaceBet,
  disabled = false,
}) => {
  const [betAmount, setBetAmount] = useState<number>(maxBet > 0 ? Math.min(10, maxBet) : 0);
  
  const handleSliderChange = (value: number[]) => {
    setBetAmount(value[0]);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= maxBet) {
      setBetAmount(value);
    }
  };
  
  const handleQuickBet = (percentage: number) => {
    const newBet = Math.floor((maxBet * percentage) * 100) / 100;
    setBetAmount(newBet);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <DollarSign size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="number"
            value={betAmount.toString()}
            onChange={handleInputChange}
            min={0}
            max={maxBet}
            step={0.01}
            className="pl-8"
            disabled={disabled || maxBet <= 0}
          />
        </div>
        <Button 
          onClick={() => onPlaceBet(betAmount)}
          className="casino-btn"
          disabled={disabled || betAmount <= 0 || betAmount > maxBet}
        >
          Place Bet
        </Button>
      </div>
      
      <div className="space-y-2">
        <Slider
          defaultValue={[betAmount]}
          max={maxBet}
          step={0.01}
          onValueChange={handleSliderChange}
          value={[betAmount]}
          disabled={disabled || maxBet <= 0}
          className="py-2"
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$0</span>
          <span>{formatCurrency(maxBet)}</span>
        </div>
      </div>
      
      <div className="flex justify-between gap-2 pt-2">
        {[0.25, 0.5, 0.75, 1].map((percent) => (
          <Button
            key={percent}
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => handleQuickBet(percent)}
            disabled={disabled || maxBet <= 0}
          >
            {percent === 1 ? "Max" : `${percent * 100}%`}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BettingControls;
