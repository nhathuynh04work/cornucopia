function ModalContentGeneral({ data, onChange }) {
	return (
		<div className="flex-1 p-6 bg-[#f7f7f8] rounded-l-2xl overflow-y-auto text-gray-700 text-sm space-y-6">
			{/* Title field */}
			<div>
				<label
					htmlFor="test-title"
					className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
					Test title
				</label>
				<input
					id="test-title"
					type="text"
					placeholder="Enter your test title"
					value={data.title}
					onChange={(e) => onChange("title", e.target.value)}
					className="w-full px-3 py-2 rounded-md border border-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm bg-[#f7f7f8]"
				/>
			</div>

			{/* Description field */}
			<div>
				<label
					htmlFor="test-description"
					className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
					Description
				</label>
				<textarea
					id="test-description"
					rows={5}
					placeholder="Write a brief description of the test..."
					value={data.description}
					onChange={(e) => onChange("description", e.target.value)}
					className="w-full px-3 py-2 rounded-md border border-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm resize-none bg-[#f7f7f8]"
				/>
			</div>
		</div>
	);
}

export default ModalContentGeneral;
