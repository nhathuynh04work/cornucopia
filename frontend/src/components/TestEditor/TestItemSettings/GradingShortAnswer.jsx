import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import ScoreInput from "./ScoreInput";
import { useUpdateItem } from "@/hooks/useTestMutation";

export default function GradingShortAnswer({ currentItem }) {
	const { mutate } = useUpdateItem(currentItem.id);

	const {
		register,
		watch,
		handleSubmit,
		reset,
		formState: { isDirty },
	} = useForm({
		defaultValues: {
			points: currentItem.points,
			answer: currentItem.answer,
		},
	});

	const debouncedMutate = useMemo(
		() =>
			debounce(
				handleSubmit((data) => mutate(data)),
				500
			),
		[mutate, handleSubmit]
	);

	useEffect(() => {
		if (isDirty) {
			const subscription = watch(debouncedMutate);
			return () => subscription.unsubscribe();
		}
	}, [isDirty, watch, debouncedMutate]);

	// resets the form AND cancels pending mutations
	useEffect(() => {
		reset({
			points: currentItem.points,
			answer: currentItem.answer,
		});

		// CRITICAL: Cancel any pending mutation from the previous state
		debouncedMutate.cancel();
	}, [currentItem, reset, debouncedMutate]);

	return (
		<div className="space-y-2">
			<div className="flex flex-col space-y-2">
				<div className="flex items-center gap-4">
					<label className="text-[11px] font-medium text-gray-500 w-20">
						Answer
					</label>
					<input
						{...register("answer")}
						className="w-full px-2 py-1 rounded-md border border-gray-300 bg-gray-50 text-xs focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none text-right"
					/>
				</div>
				<ScoreInput register={register} />
			</div>
		</div>
	);
}
