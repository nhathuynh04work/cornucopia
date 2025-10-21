export default function FlashcardStudyCard({ card, isFlipped, onFlip }) {
  if (!card) return null;

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
          <h3 className="text-sm text-gray-500 mb-2">Thuật ngữ</h3>
          <p className="px-4">{card.term}</p>
        </div>

        {/* Mặt sau */}
        <div className="absolute w-full h-full bg-[#f3f4f6] text-[#1e40af] flex flex-col items-center justify-center text-lg font-medium rounded-2xl shadow-md border border-[#cbd5e1] [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <h3 className="text-sm text-gray-500 mb-2">Định nghĩa</h3>
          <p className="px-4">{card.definition}</p>
        </div>
      </div>
    </div>
  );
}
