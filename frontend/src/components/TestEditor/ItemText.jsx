import { useState, useMemo, useEffect } from "react";
import { useUpdateItemMutation } from "../../hooks/useItemMutation";
import { debounce } from "lodash";
import { useTestEditorStore } from "../../store/testEditorStore";

function ItemText() {
	const item = useTestEditorStore((s) => s.getCurrentItem());
	const text = item?.text || "";
	const [value, setValue] = useState(text);
	const { mutate: updateItem } = useUpdateItemMutation(item);

	const debouncedUpdate = useMemo(
		() =>
			debounce((newValue) => updateItem({ text: newValue }), 1000, {
				leading: false,
				trailing: true,
			}),
		[updateItem]
	);

	function handleChange(e) {
		const newValue = e.target.value;
		setValue(newValue);
		debouncedUpdate(newValue);
	}

	useEffect(() => {
		setValue(text);
	}, [text]);

	return (
		<input
			type="text"
			value={value}
			onChange={handleChange}
			className="w-full bg-transparent focus:outline-none focus:ring-0"
			placeholder="..."
		/>
	);
}

export default ItemText;
