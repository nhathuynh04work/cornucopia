import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import ScoreInput from "./ScoreInput";
import { useUpdateItem, useUpdateOption } from "@/hooks/useTestMutation";

// Helper function
function findCorrectOptionId(options) {
	return options?.find((opt) => opt.isCorrect)?.id;
}

export default function GradingMultipleChoice({ currentItem }) {
	// -------------------- Points --------------------
	const { mutate: updateItem } = useUpdateItem(currentItem.id);

	const {
		register,
		watch,
		handleSubmit,
		reset,
		formState: { isDirty },
	} = useForm({
		defaultValues: { points: currentItem.points },
	});

	const debouncedMutatePoints = useMemo(
		() =>
			debounce(
				handleSubmit((data) => {
					updateItem({ points: data.points });
				}),
				500
			),
		[updateItem, handleSubmit]
	);

	useEffect(() => {
		if (isDirty) {
			const subscription = watch(debouncedMutatePoints);
			return () => subscription.unsubscribe();
		}
	}, [isDirty, watch, debouncedMutatePoints]);

	// ------------------------------------------------

	// -------------------- Answer --------------------
	const { mutate: updateOption } = useUpdateOption();
	const [selectedAnswer, setSelectedAnswer] = useState(
		findCorrectOptionId(currentItem.answerOptions)
	);

	function handleAnswerChange(e) {
		const newCorrectOptionId = parseInt(e.target.value);
		setSelectedAnswer(newCorrectOptionId);
		updateOption({
			id: newCorrectOptionId,
			data: { isCorrect: true },
		});
	}
	// ------------------------------------------------

	// Runs when currentItem changed by user
	useEffect(() => {
		// Reset points form + correct option
		reset({ points: currentItem.points });
		const currentCorrectId = findCorrectOptionId(currentItem.answerOptions);

		// CRITICAL: Cancel pending points mutations
		debouncedMutatePoints.cancel();

		setSelectedAnswer(currentCorrectId);
	}, [currentItem, reset, debouncedMutatePoints]);

	return (
		<div className="space-y-2">
			<div className="flex items-center gap-4">
				<label className="text-[11px] font-medium text-gray-500 w-20">
					Answer
				</label>
				<select
					value={selectedAnswer || ""}
					onChange={handleAnswerChange}
					className="w-full px-2 py-1 rounded-md border border-gray-300 bg-gray-50 text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none text-right">
					<option value="" disabled>
						Select an answer
					</option>
					{currentItem.answerOptions?.map((option, index) => (
						<option key={option.id} value={option.id}>
							{String.fromCharCode(65 + index)}
						</option>
					))}
				</select>
			</div>

			<ScoreInput register={register} />
		</div>
	);
}
