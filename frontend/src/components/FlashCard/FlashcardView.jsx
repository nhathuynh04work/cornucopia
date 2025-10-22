// src/components/FlashcardView.jsx
import { useState } from "react";

export default function FlashcardView({ card }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-[600px] h-[350px] cursor-pointer [perspective:1000px]"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div className="absolute w-full h-full bg-blue-500 border-2 border-blue-300 flex items-center justify-center text-2xl text-white font-semibold rounded-2xl shadow-md [backface-visibility:hidden]">
          {card?.term || "(Trống)"}
        </div>

        <div className="absolute w-full h-full bg-gray-300 text-blue-500 flex items-center justify-center text-xl font-medium rounded-2xl shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {card?.definition || "(Trống)"}
        </div>
      </div>
    </div>
  );
}
