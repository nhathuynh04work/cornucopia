import { createContext, useContext } from "react";

const ItemListContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useItemList() {
	return useContext(ItemListContext);
}

export function ItemListProvider({ children, onAddItem }) {
	return (
		<ItemListContext.Provider value={{ onAddItem }}>
			{children}
		</ItemListContext.Provider>
	);
}
