import { LayoutTemplate } from "lucide-react";

export default function ExcerptInput({ register, watch }) {
	const excerptText = watch("excerpt") || "";
	const charCount = excerptText.length;
	const isOverLimit = charCount > 300;

	return (
		<div className="space-y-3">
			<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
				<LayoutTemplate className="w-4 h-4 text-gray-500" />
				Tóm tắt
			</label>

			<div className="relative">
				<textarea
					{...register("excerpt", { maxLength: 300 })}
					placeholder="Viết một bản tóm tắt ngắn..."
					rows={4}
					className={`w-full px-3 py-2.5 rounded-lg bg-gray-50 border focus:bg-white focus:ring-2 transition-all outline-none text-sm resize-none
                        ${
							isOverLimit
								? "border-red-300 focus:border-red-500 focus:ring-red-100"
								: "border-gray-200 focus:border-purple-500 focus:ring-purple-100"
						}
                    `}
				/>
				<span
					className={`absolute bottom-2 right-2 text-xs font-medium ${
						isOverLimit ? "text-red-500" : "text-gray-400"
					}`}>
					{charCount}/300
				</span>
			</div>
		</div>
	);
}
