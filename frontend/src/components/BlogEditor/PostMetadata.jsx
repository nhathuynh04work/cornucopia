import { LayoutTemplate, Tag } from "lucide-react";

export default function PostMetadata({ register }) {
	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
					<LayoutTemplate className="w-4 h-4 text-gray-400" />
					Excerpt
				</label>
				<textarea
					{...register("excerpt")}
					placeholder="Write a short summary..."
					rows={4}
					className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none text-sm resize-none"
				/>
				<p className="text-xs text-gray-400 text-right">0/160</p>
			</div>

			<div className="space-y-3">
				<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
					<Tag className="w-4 h-4 text-gray-400" />
					Tags
				</label>
				<input
					{...register("tags")}
					type="text"
					placeholder="Add tags separated by commas..."
					className="w-full px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all outline-none text-sm"
				/>
			</div>
		</div>
	);
}
