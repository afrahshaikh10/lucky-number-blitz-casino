
import React from "react";
import { cn } from "@/lib/utils";

interface NumberSelectorProps {
  selectedNumber: number | null;
  onSelectNumber: (num: number) => void;
  disabled?: boolean;
}

const NumberSelector: React.FC<NumberSelectorProps> = ({
  selectedNumber,
  onSelectNumber,
  disabled = false,
}) => {
  // Numbers 1-10
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="w-full p-4">
      <h3 className="text-lg font-medium mb-3 text-center">Choose Your Number</h3>
      <div className="grid grid-cols-5 gap-2">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => onSelectNumber(num)}
            className={cn(
              "number-button",
              selectedNumber === num && "selected"
            )}
            disabled={disabled}
            aria-pressed={selectedNumber === num}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumberSelector;
