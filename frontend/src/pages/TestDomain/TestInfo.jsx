import { useParams, useNavigate } from "react-router-dom";
import { useGetTestForInfo } from "@/hooks/useTestQuery";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import TestHero from "@/components/TestInfo/TestHero";
import TestStats from "@/components/TestInfo/TestStats";
import TestBestResult from "@/components/TestInfo/TestBestResult";
import TestAuthor from "@/components/TestInfo/TestAuthor";
import TestTabs from "@/components/TestInfo/TestTabs";

export default function TestInfo() {
	const { testId } = useParams();
	const navigate = useNavigate();

	const { data: test, isPending, isError } = useGetTestForInfo(testId);

	if (isPending) {
		return (
			<div className="h-[80vh] flex flex-col items-center justify-center text-gray-400">
				<Loader2 className="w-10 h-10 animate-spin mb-3 text-purple-500" />
				<p>Đang tải thông tin bài thi...</p>
			</div>
		);
	}

	if (isError || !test) {
		return (
			<div className="h-[80vh] flex flex-col items-center justify-center text-red-500 bg-red-50 rounded-3xl border border-red-100 p-8 m-6">
				<AlertCircle className="w-12 h-12 mb-4" />
				<h2 className="text-lg font-bold text-gray-900">
					Không tìm thấy bài kiểm tra
				</h2>
				<button
					onClick={() => navigate("/tests")}
					className="mt-4 text-sm font-medium text-gray-600 hover:text-gray-900 underline">
					Quay lại danh sách
				</button>
			</div>
		);
	}

	const questionCount = test._count?.items || 0;
	const attemptsCount = test._count?.attempts || 0;

	return (
		<div className="p-6 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
			{/* --- Back Button --- */}
			<button
				onClick={() => navigate("/tests")}
				className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6 group">
				<ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
				Quay lại thư viện
			</button>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* --- LEFT COLUMN (Content) --- */}
				<div className="lg:col-span-2 space-y-8">
					<TestHero test={test} />
					<TestTabs testId={testId} />
				</div>

				{/* --- RIGHT COLUMN (Stats & Info) --- */}
				<div className="space-y-6">
					<TestStats
						test={test}
						questionCount={questionCount}
						attemptsCount={attemptsCount}
					/>

					<TestBestResult testId={testId} />

					<TestAuthor user={test.user} createdAt={test.createdAt} />
				</div>
			</div>
		</div>
	);
}
