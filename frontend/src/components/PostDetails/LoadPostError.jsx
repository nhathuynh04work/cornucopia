import { AlertCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoadPostError({ error }) {
	return (
		<div className="h-[80vh] flex flex-col items-center justify-center text-center p-6">
			<div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 border border-red-100">
				<AlertCircle className="w-10 h-10 text-red-500" />
			</div>
			<h2 className="text-2xl font-bold text-gray-900 mb-3">
				Không thể tải bài viết
			</h2>
			<p className="text-gray-500 mb-8 max-w-md">
				{error?.message ||
					"Bài viết bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại."}
			</p>
			<Link
				to="/posts"
				className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
				<ArrowLeft className="w-5 h-5" />
				Quay lại Blog
			</Link>
		</div>
	);
}
