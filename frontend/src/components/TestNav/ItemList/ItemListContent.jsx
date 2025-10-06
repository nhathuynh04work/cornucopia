import Item from "./Item";

function ItemListContent({ currentSection }) {
	return (
		<div className="hide-scrollbar flex-1 overflow-y-auto p-4 space-y-1">
			{currentSection?.items?.length ? (
				currentSection.items.map((itemId) => (
					<Item key={itemId} id={itemId} />
				))
			) : (
				<p className="text-xs text-gray-400 italic">
					No items yet. Add one above.
				</p>
			)}
		</div>
	);
}

export default ItemListContent;
