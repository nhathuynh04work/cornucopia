import PostCard from "./PostCard";
import { FileText } from "lucide-react";

function PostsList({ posts }) {
	if (!posts || posts.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center">
				<div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
					<FileText className="w-10 h-10" />
				</div>
				<h3 className="text-lg font-bold text-gray-900 mb-1">
					Chưa có bài viết nào
				</h3>
				<p className="text-gray-500 max-w-sm">
					Hãy là người đầu tiên chia sẻ kiến thức với cộng đồng!
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{posts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</div>
	);
}

export default PostsList;
