import { Loader2, Plus } from "lucide-react";
import { useCreatePost } from "@/hooks/usePostMutation";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export default function CreatePostButton() {
	const navigate = useNavigate();
	const { mutate: createPost, isPending } = useCreatePost();

	function handleCreatePost() {
		createPost(
			{},
			{
				onSuccess: (post) => {
					navigate(`/posts/${post.id}/edit`);
					toast.success("Tạo bài viết mới thành công!");
				},
			}
		);
	}

	return (
		<button
			onClick={handleCreatePost}
			disabled={isPending}
			className="group relative flex flex-col items-center justify-center h-full min-h-[200px] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden">
			<div className="absolute inset-0 bg-purple-100 opacity-0 group-hover:opacity-20 transition-opacity"></div>

			{isPending ? (
				<Loader2 className="w-8 h-8 animate-spin text-purple-500" />
			) : (
				<>
					<div className="flex items-center justify-center w-12 h-12 mb-2 rounded-full border-2 border-current bg-white/60">
						<Plus className="w-6 h-6" />
					</div>
					<span className="text-sm font-medium">Tạo bài viết</span>
				</>
			)}
		</button>
	);
}
