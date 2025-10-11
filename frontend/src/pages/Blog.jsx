import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../apis/axios";
import BlogList from "../components/BlogList";
import { stripHtml } from "../lib/text";

function Blog() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	// Tạo bài viết mặc định rồi chuyển sang Editor
	const handleCreateNewPost = async () => {
		try {
			const { data } = await api.post("/posts", { userId: 1 });
			navigate(`/blog/${data.id}/edit`);
		} catch (e) {
			console.error(e);
			alert("Không tạo được bài viết mới");
		}
	};

	// Xóa 1 bài
	const handleDelete = async (id) => {
		if (!confirm("Xóa bài viết này?")) return;
		try {
			await api.delete(`/posts/${id}`);
			setPosts((prev) => prev.filter((p) => p.id !== id));
		} catch (err) {
			console.error(err);
			alert("Xóa thất bại");
		}
	};

	// Tải danh sách từ API
	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const { data } = await api.get("/posts");
				const raw = Array.isArray(data) ? data : data.posts || [];
				const mapped = raw.map((p) => ({
					...p,
					excerpt:
						p.excerpt ??
						(p.content
							? stripHtml(p.content).slice(0, 160) + "..."
							: ""),
					onDelete: handleDelete, // truyền xuống item
				}));
				setPosts(mapped);
			} catch (e) {
				console.error(e);
				alert("Không tải được danh sách bài viết");
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	if (loading) return <p className="p-4">Loading...</p>;

	return (
		<div className="pb-8">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 flex items-center justify-between">
				<h1 className="text-2xl font-bold">Blog</h1>
				<button
					className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					onClick={handleCreateNewPost}>
					Tạo bài viết
				</button>
			</div>

			<BlogList posts={posts} title="Bài viết nổi bật" />
		</div>
	);
}

export default Blog;
