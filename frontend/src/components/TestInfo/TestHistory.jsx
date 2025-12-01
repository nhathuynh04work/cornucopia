import { Loader2, History } from "lucide-react";
import { useGetAttemptHistory } from "@/hooks/useTestQuery";
import AttemptItem from "./AttemptItem";

export default function TestHistory({ testId }) {
	const { data: attempts, isPending: isLoading } =
		useGetAttemptHistory(testId);

	return (
		<div className="p-6 animate-in fade-in duration-500">
			{isLoading ? (
				<div className="flex justify-center py-8">
					<Loader2 className="w-6 h-6 animate-spin text-gray-300" />
				</div>
			) : attempts && attempts.length > 0 ? (
				<div className="space-y-3">
					{attempts.map((attempt) => (
						<AttemptItem key={attempt.id} attempt={attempt} />
					))}
				</div>
			) : (
				<div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
					<div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
						<History className="w-6 h-6" />
					</div>
					<p className="text-gray-500 text-sm">
						Bạn chưa làm bài kiểm tra này lần nào.
					</p>
				</div>
			)}
		</div>
	);
}
