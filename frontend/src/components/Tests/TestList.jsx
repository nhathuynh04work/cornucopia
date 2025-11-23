import TestCard from "./TestCard";
import { FileQuestion } from "lucide-react";

function TestList({ tests }) {
	if (!tests || tests.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center">
				<div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
					<FileQuestion className="w-10 h-10" />
				</div>
				<h3 className="text-lg font-bold text-gray-900 mb-1">
					Chưa có bài kiểm tra nào
				</h3>
				<p className="text-gray-500 max-w-sm">
					Hiện tại chưa có bài kiểm tra công khai nào. Hãy quay lại
					sau nhé!
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
			{tests.map((test) => (
				<TestCard key={test.id} test={test} />
			))}
		</div>
	);
}

export default TestList;
