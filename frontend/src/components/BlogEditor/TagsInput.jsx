import { Tag } from "lucide-react";

export default function TagsInput({ register, watch }) {
	const tagsString = watch("tags") || "";

	const tagsList = tagsString
		.split(",")
		.map((t) => t.trim())
		.filter((t) => t.length > 0);

	return (
		<div className="space-y-3">
			<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
				<Tag className="w-4 h-4 text-gray-500" />
				Tags
			</label>

			<input
				{...register("tags")}
				type="text"
				placeholder="tech, life, coding..."
				className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none text-sm"
			/>

			{/* Visual Tag Pills */}
			{tagsList.length > 0 && (
				<div className="flex flex-wrap gap-2 pt-1">
					{tagsList.map((tag, index) => (
						<span
							key={index}
							className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 text-xs font-medium border border-purple-100">
							#{tag}
						</span>
					))}
				</div>
			)}
		</div>
	);
}
