export default function FlashcardNavigator({ current, total, onPrev, onNext }) {
  return (
    <div className="mt-6 flex items-center justify-center gap-6">
      <button
        onClick={onPrev}
        disabled={current === 0}
        className={`px-4 py-2 rounded-lg font-medium transition ${
          current === 0
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        ←
      </button>

      <p className="text-gray-500 text-sm font-medium">
        {current + 1}/{total}
      </p>

      <button
        onClick={onNext}
        disabled={current + 1 >= total}
        className={`px-4 py-2 rounded-lg font-medium transition ${
          current + 1 >= total
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        →
      </button>
    </div>
  );
}
