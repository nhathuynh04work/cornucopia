import ItemListContent from "./ItemListContent";
import ItemListHeader from "./ItemListHeader";

function ItemList() {
	return (
		<section className="flex-1 min-h-0 flex flex-col">
			<ItemListHeader />
			<ItemListContent />
		</section>
	);
}

export default ItemList;
