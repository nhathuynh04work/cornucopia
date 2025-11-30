import BlogEditor from "@/components/PostEditor/BlogEditor";
import { useGetPostDetails } from "@/hooks/usePostQuery";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router";

export default function BlogEdit() {
	const { postId } = useParams();
	const { data: post, isPending, isError } = useGetPostDetails(postId);

	if (isPending) {
		return (
			<div className="h-screen flex items-center justify-center bg-white">
				<div className="flex flex-col items-center gap-3">
					<Loader2 className="w-8 h-8 animate-spin text-purple-600" />
					<p className="text-gray-500 text-sm font-medium">
						Đang tải trình soạn thảo...
					</p>
				</div>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="h-screen flex items-center justify-center text-red-500">
				<p>Lỗi khi tải cấu hình bài viết.</p>
			</div>
		);
	}

	return <BlogEditor key={post.id} post={post} />;
}
