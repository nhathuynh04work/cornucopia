import { AlertCircle } from "lucide-react";
import { Link } from "react-router";

function LoadPostError({ error }) {
	return (
		<div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
			<div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
				<AlertCircle className="w-8 h-8 text-red-500" />
			</div>
			<h2 className="text-2xl font-bold text-gray-900 mb-2">
				Failed to load post
			</h2>
			<p className="text-gray-500 mb-6 max-w-md">
				{error?.message ||
					"The post you are looking for might have been removed or is temporarily unavailable."}
			</p>
			<Link
				to="/posts"
				className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
				Back to Blog
			</Link>
		</div>
	);
}

export default LoadPostError;
