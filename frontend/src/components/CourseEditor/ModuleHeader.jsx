import { useState, useRef, useEffect } from "react";
import {
	useDeleteModuleMutation,
	useUpdateModuleMutation,
} from "@/hooks/useModuleMutation";
import { GripVertical, Trash2, Edit, Loader2, Check, X } from "lucide-react";

export default function ModuleHeader({ module }) {
	// State
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(module.title);
	const inputRef = useRef(null);

	// Mutations
	const { mutate: deleteModule, isPending: isDeleting } =
		useDeleteModuleMutation(module.id);
	const { mutateAsync: updateModule, isPending: isUpdating } =
		useUpdateModuleMutation(module.id);

	// Auto-focus logic
	useEffect(() => {
		if (isEditing && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.select();
		}
	}, [isEditing]);

	// Handlers
	async function handleSave() {
		await updateModule({ title: title });
		setIsEditing(false);
	}

	function handleCancel() {
		setIsEditing(false);
		setTitle(module.title);
	}

	return (
		<div className="flex items-center justify-between p-4 border-b border-gray-200">
			{/* Left side: Grip and Title/Input */}
			<div className="flex items-center gap-2 w-full">
				<GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
				{isEditing ? (
					<input
						ref={inputRef}
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleSave()}
						className="font-semibold text-gray-800 border-b border-purple-300 w-full p-0"
						disabled={isUpdating}
					/>
				) : (
					<span className="font-semibold text-gray-800">{title}</span>
				)}
			</div>

			{/* Right side: Buttons */}
			<div className="flex items-center gap-3 ml-4 flex-shrink-0">
				{isEditing ? (
					<>
						<button onClick={handleSave} disabled={isUpdating}>
							{isUpdating ? (
								<Loader2 className="w-4 h-4 animate-spin text-gray-500" />
							) : (
								<Check className="w-4 h-4 text-green-600" />
							)}
						</button>
						<button onClick={handleCancel} disabled={isUpdating}>
							<X className="w-4 h-4 text-gray-500" />
						</button>
					</>
				) : (
					<>
						<button
							onClick={() => setIsEditing(true)}
							disabled={isDeleting}>
							<Edit className="w-4 h-4 text-gray-500" />
						</button>
						<button onClick={deleteModule} disabled={isDeleting}>
							{isDeleting ? (
								<Loader2 className="w-4 h-4 animate-spin text-gray-500" />
							) : (
								<Trash2 className="w-4 h-4 text-gray-500" />
							)}
						</button>
					</>
				)}
			</div>
		</div>
	);
}
