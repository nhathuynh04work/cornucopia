import { Volume2 } from "lucide-react";

export default function FlashcardStudyCard({ card, isFlipped, onFlip }) {
  if (!card) return null;

  const speak = (text) => {
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US"; // hoặc 'vi-VN' nếu muốn phát tiếng Việt
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  };

  return (
    <div
      className="relative w-full h-64 cursor-pointer [perspective:1000px]"
      onClick={onFlip}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Mặt trước */}
        <div className="absolute w-full h-full bg-[#dbeafe] border border-[#c7d2fe] flex flex-col items-center justify-center text-2xl text-[#1e3a8a] font-semibold rounded-2xl shadow-md [backface-visibility:hidden]">
          <button
            onClick={(e) => {
              e.stopPropagation(); // tránh flip khi bấm nút
              speak(card.term);
            }}
            className="absolute top-3 right-3 text-blue-700 hover:text-blue-900"
            title="Phát âm thuật ngữ"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <h3 className="text-sm text-gray-500 mb-2">Thuật ngữ</h3>
          <p className="px-4">{card.term}</p>
        </div>

        {/* Mặt sau */}
        <div className="absolute w-full h-full bg-[#f3f4f6] text-[#1e40af] flex flex-col items-center justify-center text-lg font-medium rounded-2xl shadow-md border border-[#cbd5e1] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              speak(card.definition);
            }}
            className="absolute top-3 right-3 text-blue-700 hover:text-blue-900"
            title="Phát âm định nghĩa"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <h3 className="text-sm text-gray-500 mb-2">Định nghĩa</h3>
          <p className="px-4">{card.definition}</p>
        </div>
      </div>
    </div>
  );
}
