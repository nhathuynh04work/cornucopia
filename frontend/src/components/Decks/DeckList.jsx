import DeckCard from "./DeckCard";

export default function DeckList({
	decks,
	isPending,
	searchTerm,
	emptyMessage,
	searchEmptyMessage,
	prependItem,
	className,
}) {
	if (isPending) {
		return (
			<p className="p-6 text-center text-gray-500">Đang tải bộ thẻ...</p>
		);
	}

	if (!decks || (decks.length === 0 && !prependItem)) {
		const message = searchTerm ? searchEmptyMessage : emptyMessage;
		return <p className="text-center text-gray-500 mt-10">{message}</p>;
	}

	return (
		<div
			className={`${
				className
					? className
					: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
			}`}>
			{prependItem}
			{decks.map((deck) => (
				<DeckCard key={deck.id} deck={deck} />
			))}
		</div>
	);
}
