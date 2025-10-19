function FlashcardCard({ card, onEdit, onDelete }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white relative">
      <h3 className="text-lg font-semibold mb-2">📄 {card.term}</h3>
      <p className="text-gray-700 mb-3">📘 {card.definition}</p>

      <div className="absolute top-3 right-3 flex gap-3">
        <button
          onClick={onEdit}
          className="text-blue-500 hover:text-blue-700 text-xl"
        >
          ✏️
        </button>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 text-xl"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default FlashcardCard;