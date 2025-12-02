import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import attemptApi from "@/apis/attemptApi";
import PageHeader from "@/components/Shared/PageHeader";
import ResultSummary from "@/components/AttemptResult/ResultSummary";
import QuestionResultList from "@/components/AttemptResult/QuestionResultList";
import SEO from "@/components/Shared/SEO";

export default function AttemptResult() {
	const { attemptId } = useParams();
	const navigate = useNavigate();

	const {
		data: result,
		isPending,
		isError,
	} = useQuery({
		queryKey: ["attemptResult", attemptId],
		queryFn: () => attemptApi.getResult(attemptId),
		retry: false,
	});

	if (isPending) {
		return (
			<div className="h-[80vh] flex flex-col items-center justify-center text-gray-400">
				<Loader2 className="w-10 h-10 animate-spin mb-3 text-purple-500" />
				<p>Đang tính điểm...</p>
			</div>
		);
	}

	if (isError || !result) {
		return (
			<div className="h-[80vh] flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-3xl border border-red-100 p-8 m-6">
				<AlertCircle className="w-12 h-12 mb-4" />
				<h2 className="text-lg font-bold text-gray-900">
					Không tìm thấy kết quả
				</h2>
				<button
					onClick={() => navigate("/tests")}
					className="mt-4 text-sm font-medium text-gray-600 hover:text-gray-900 underline">
					Quay lại danh sách
				</button>
			</div>
		);
	}

	const { test } = result;

	return (
		<>
			<div className="h-[calc(100vh-110px)] w-full max-w-[1600px] mx-auto flex flex-col overflow-hidden hide-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500">
				{/* Header Section (Fixed) */}
				<div className="flex-shrink-0 mb-6 px-6 pt-2">
					<button
						onClick={() => navigate(`/tests/${test.id}`)}
						className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4 group">
						<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
						Quay lại bài kiểm tra
					</button>

					<PageHeader
						title="Kết quả làm bài"
						description={`Bạn đã hoàn thành bài kiểm tra "${test.title}"`}
						className="mb-0"
					/>
				</div>

				{/* Content Section (Flex Grow to fill remaining space) */}
				<div className="flex-1 min-h-0 px-6 pb-2">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
						{/* Left Column: Stats - Scrollable */}
						<div className="lg:col-span-4 h-full overflow-y-auto hide-scrollbar pr-2">
							<ResultSummary result={result} />
						</div>

						{/* Right Column: Question List - Takes remaining height */}
						<div className="lg:col-span-8 h-full flex flex-col min-h-0">
							<div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-full overflow-hidden">
								<div className="p-6 border-b border-gray-100 flex-shrink-0">
									<h3 className="font-bold text-lg text-gray-900">
										Chi tiết đáp án
									</h3>
								</div>

								{/* Container for the list, ensures it scrolls internally */}
								<div className="flex-1 min-h-0 relative bg-gray-50/30">
									<QuestionResultList items={test.items} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<SEO
				title={`Kết quả thi | ${test.title}`}
				description={`Kết quả thi | ${test.title}`}
			/>
		</>
	);
}
