"use client";

import { useState } from "react";
import { Rating } from "@/types";

interface MenuRatingProps {
  menuId: string;
  customerId: string;
  ratings?: Rating[];
}

const MenuRating: React.FC<MenuRatingProps> = ({
  menuId,
  customerId,
  ratings = [],
}) => {
  const existingRating = ratings.find((r) => r.customer_id === customerId);
  const [selectedRating, setSelectedRating] = useState(
    existingRating?.rating ?? 0
  );
  const [isSubmitted, setIsSubmitted] = useState(!!existingRating);

  const handleClick = async (rating: number) => {
    if (isSubmitted) return;

    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          menu_id: menuId,
          rating,
        }),
      });
      console.log(menuId, rating, res);

      if (res.ok) {
        setSelectedRating(rating);
        setIsSubmitted(true);
      } else {
        console.error("Failed to submit rating.");
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium mb-1 md:mb-0">
          {isSubmitted ? "You rated this item:" : "Rate this item:"}
        </p>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleClick(star)}
              disabled={isSubmitted}
              className={`text-2xl transition ${
                star <= selectedRating ? "text-yellow-500" : "text-gray-300"
              } ${!isSubmitted && "hover:scale-110 hover:text-yellow-400"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuRating;
