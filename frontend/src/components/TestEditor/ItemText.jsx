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
		<textarea
			value={value}
			onChange={handleChange}
			className="flex-1 bg-transparent focus:outline-none focus:ring-0 resize-none"
			placeholder="..."
			rows={3}
		/>
	);
}

export default ItemText;
