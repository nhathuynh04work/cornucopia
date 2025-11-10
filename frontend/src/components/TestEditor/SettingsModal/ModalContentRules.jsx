import { useFormContext } from "react-hook-form";

function ModalContentRules() {
	const { register } = useFormContext();

	const options = Array.from({ length: 12 }, (_, i) => {
		const minutes = (i + 1) * 15;
		return { label: `${minutes} minutes`, value: minutes * 60 };
	});

	return (
		<div className="flex-1 p-6 bg-[#f7f7f8] rounded-l-2xl overflow-y-auto text-gray-700 text-sm space-y-6">
			<div>
				<label
					htmlFor="timeLimit"
					className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
					Time Limit
				</label>

				<select
					id="timeLimit"
					{...register("timeLimit", { valueAsNumber: true })}
					className="w-1/2 px-3 py-2 rounded-md border border-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm bg-white">
					{options.map((opt) => (
						<option key={opt.label} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>

				<p className="mt-2 text-xs text-gray-500">
					Set a time limit for the test.
				</p>
			</div>
		</div>
	);
}

export default ModalContentRules;
