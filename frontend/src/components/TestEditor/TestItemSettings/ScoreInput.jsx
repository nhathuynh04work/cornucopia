export default function ScoreInput({ register }) {
	return (
		<div className="flex flex-col gap-1">
			<div className="flex items-center gap-4">
				<label className="text-[11px] font-medium text-gray-500 w-20">
					Points
				</label>
				<input
					{...register("points", { valueAsNumber: true })}
					type="number"
					step="1"
					min={1}
					className={`w-full px-2 py-1 rounded-md border bg-gray-50 text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none text-right`}
				/>
			</div>
		</div>
	);
}
