"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (score: number) => void;
  className?: string;
}

export default function StarRating({
  value,
  max = 5,
  size = 18,
  interactive = false,
  onChange,
  className = "",
}: StarRatingProps) {
  const safeValue = Math.max(0, Math.min(value, max));
  const roundedValue = Math.round(safeValue * 10) / 10;

  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label={`Rating: ${roundedValue} out of ${max}`}>
      {Array.from({ length: max }).map((_, index) => {
        const starNumber = index + 1;
        const isFilled = starNumber <= roundedValue;

        if (!interactive) {
          return (
            <Star
              key={starNumber}
              size={size}
              className={isFilled ? "text-golden-500" : "text-brown-200"}
              fill={isFilled ? "currentColor" : "none"}
              aria-hidden="true"
            />
          );
        }

        return (
          <button
            key={starNumber}
            type="button"
            onClick={() => onChange?.(starNumber)}
            className="transition-transform hover:scale-110"
            aria-label={`Rate ${starNumber} out of ${max}`}
          >
            <Star
              size={size}
              className={isFilled ? "text-golden-500" : "text-brown-200 hover:text-golden-400"}
              fill={isFilled ? "currentColor" : "none"}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}
