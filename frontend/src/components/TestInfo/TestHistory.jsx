import { Loader2, History, ChevronRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatTime, formatVNDateTime } from "@/lib/formatters";

export default function TestHistory({ attempts, isLoading, testId }) {
	const navigate = useNavigate();

	return (
		<div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
			<div className="flex items-center gap-3 mb-6">
				<div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
					<History className="w-5 h-5" />
				</div>
				<h2 className="text-xl font-bold text-gray-900">
					Lịch sử làm bài
				</h2>
			</div>

			{isLoading ? (
				<div className="flex justify-center py-8">
					<Loader2 className="w-6 h-6 animate-spin text-gray-300" />
				</div>
			) : attempts && attempts.length > 0 ? (
				<div className="space-y-3">
					{attempts.map((attempt) => (
						<div
							key={attempt.id}
							onClick={() =>
								navigate(
									`/tests/${testId}/result/${attempt.id}`
								)
							}
							className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-purple-200 hover:bg-white hover:shadow-md transition-all cursor-pointer group">
							<div className="flex items-center gap-4">
								<div
									className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
										(attempt.scoredPoints || 0) >= 80
											? "bg-green-100 text-green-700"
											: (attempt.scoredPoints || 0) >= 50
											? "bg-yellow-100 text-yellow-700"
											: "bg-red-100 text-red-700"
									}`}>
									{attempt.scoredPoints ?? "?"}
								</div>
								<div>
									<p className="font-bold text-gray-900 text-sm">
										{formatVNDateTime(attempt.createdAt)}
									</p>
									<div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
										<Clock className="w-3 h-3" />
										{formatTime(attempt.time)}
									</div>
								</div>
							</div>
							<ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 transition-colors" />
						</div>
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
