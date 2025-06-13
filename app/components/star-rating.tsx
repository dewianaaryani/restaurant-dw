"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  initialRating?: number;
  totalStars?: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
}

export function StarRating({
  initialRating = 0,
  totalStars = 5,
  onRatingChange,
  readOnly = false,
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (selectedRating: number) => {
    if (readOnly) return;

    setRating(selectedRating);
    if (onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  return (
    <div className="flex">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = hoverRating
          ? starValue <= hoverRating
          : starValue <= rating;

        return (
          <button
            key={index}
            type="button"
            className={cn(
              "p-1 focus:outline-none transition-colors",
              readOnly ? "cursor-default" : "cursor-pointer"
            )}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => !readOnly && setHoverRating(starValue)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            disabled={readOnly}
          >
            <Star
              className={cn(
                "h-5 w-5 transition-colors",
                isFilled
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-none text-gray-300"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
