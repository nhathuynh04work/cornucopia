import {
	useDeleteModuleMutation,
	useUpdateModuleMutation,
} from "@/hooks/useModuleMutation";
import { Trash2, Loader2 } from "lucide-react";
import EditableText from "./EditableText";

export default function ModuleHeader({ module }) {
	const { mutate: deleteModule, isPending: isDeleting } =
		useDeleteModuleMutation(module.id);
	const { mutateAsync: updateModule, isPending: isUpdating } =
		useUpdateModuleMutation(module.id);

	return (
		<div className="flex items-center justify-between p-4 border-b border-gray-200 group">
			<div className="flex items-center gap-2">
				<EditableText
					initialValue={module.title}
					onSave={(value) => updateModule({ title: value })}
					isPending={isUpdating}
					spanClassName="font-semibold text-gray-800 text-sm"
					inputClassName="font-semibold text-gray-800 text-sm w-[300px] p-0"
                    hoverBehavior="parent"
				/>
				<button
					onClick={deleteModule}
					disabled={isDeleting}
					className="text-gray-400 hover:text-gray-800 flex-shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150">
					{isDeleting ? (
						<Loader2 className="w-3 h-3 animate-spin" />
					) : (
						<Trash2 className="w-3 h-3" />
					)}
				</button>
			</div>
		</div>
	);
}
