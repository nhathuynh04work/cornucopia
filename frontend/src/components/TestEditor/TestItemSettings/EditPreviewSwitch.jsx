import { useState } from "react";
import { Pencil, Eye } from "lucide-react";

export function EditPreviewSwitch() {
	const [isEdit, setIsEdit] = useState(true);
	return (
		<div className="flex items-center text-sm font-medium bg-gray-200 rounded-md p-0.5">
			<button
				onClick={() => setIsEdit(true)}
				className={`p-1.5 rounded-md ${
					isEdit
						? "bg-white shadow-sm"
						: "text-gray-600 hover:bg-gray-100"
				}`}>
				<Pencil className="w-3.5 h-3.5" />
			</button>
			<button
				onClick={() => setIsEdit(false)}
				className={`p-1.5 rounded-md ${
					!isEdit
						? "bg-white shadow-sm"
						: "text-gray-600 hover:bg-gray-100"
				}`}>
				<Eye className="w-3.5 h-3.5" />
			</button>
		</div>
	);
}
