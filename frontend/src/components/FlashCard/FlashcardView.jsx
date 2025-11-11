// src/components/FlashcardView.jsx
import { useState } from "react";
import { Volume2 } from "lucide-react";

export default function FlashcardView({ card }) {
  const [flipped, setFlipped] = useState(false);

  const speak = (text, lang = "en-US") => {
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang; // có thể là 'en-US' hoặc 'vi-VN'
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  return (
    <div
      className="relative w-[770px] h-[400px] cursor-pointer [perspective:1000px]"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Mặt trước */}
        <div className="absolute w-full h-full bg-blue-500 border-2 border-blue-300 flex items-center justify-center text-2xl text-white font-semibold rounded-2xl shadow-md [backface-visibility:hidden]">
          <button
            onClick={(e) => {
              e.stopPropagation(); // tránh lật thẻ khi bấm nút
              speak(card?.term, "en-US");
            }}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition"
            title="Phát âm"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          {card?.term || "(Trống)"}
        </div>

        {/* Mặt sau */}
        <div className="absolute w-full h-full bg-gray-300 text-blue-500 flex items-center justify-center text-xl font-medium rounded-2xl shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              speak(card?.definition, "vi-VN");
            }}
            className="absolute top-4 right-4 text-blue-500 hover:text-blue-700 transition"
            title="Phát âm"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          {card?.definition || "(Trống)"}
        </div>
      </div>
    </div>
  );
}
