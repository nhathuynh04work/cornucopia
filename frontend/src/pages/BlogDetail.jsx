import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { api } from "@/apis/axios";
import TopicsList from "@/components/Posts/TagsList";
import { deletePost } from "@/apis/postApi";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/lib/constants";
import { Pencil, Trash } from "lucide-react";
import Avatar from "@/components/Avatar";

//table of content
function buildTocFromHtml(html) {
	if (!html || typeof window === "undefined") {
		return { html, toc: [] };
	}

	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	const nodes = doc.querySelectorAll("h2, h3");
	const toc = [];

	nodes.forEach((node, index) => {
		const level = node.tagName.toLowerCase(); // "h2" | "h3"
		const text = node.textContent || `Mục ${index + 1}`;

		let id = node.getAttribute("id");
		if (!id) {
			// slug đơn giản từ text
			id =
				text
					.toLowerCase()
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "") // bỏ dấu tiếng Việt
					.replace(/[^a-z0-9]+/g, "-")
					.replace(/^-+|-+$/g, "") || `heading-${index}`;
			node.setAttribute("id", id);
		}

		toc.push({ id, text, level });
	});

	return {
		html: doc.body.innerHTML,
		toc,
	};
}

export default function BlogDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { role, user } = useAuth();

	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(false);

	// nội dung đã được gắn id cho heading
	const [contentHtml, setContentHtml] = useState("");
	const [toc, setToc] = useState([]);

	// ===== FETCH POST DETAIL =====
	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const { data } = await api.get(`/posts/${id}`);
				const p = data.post;
				setPost(p);

				// build TOC từ content
				if (p?.content) {
					const { html, toc } = buildTocFromHtml(p.content);
					setContentHtml(html);
					setToc(toc);
				} else {
					setContentHtml("");
					setToc([]);
				}
			} catch (e) {
				console.error(e);
				toast.error("Không tải được bài viết");
			} finally {
				setLoading(false);
			}
		})();
	}, [id]);

	// ===== PERMISSIONS =====
	const isAdmin = role === Role.ADMIN;
	const isCreatorOwner =
		role === Role.CREATOR && post?.author?.id === user?.id;

	// cho xoá: ADMIN + CREATOR là tác giả
	const canDelete = isAdmin || isCreatorOwner;
	// edit giữ đúng rule backend: chỉ ADMIN
	const canEdit = isAdmin;

	// ===== DELETE MUTATION =====
	const { mutate: deletePostMutate, isPending: isDeleting } = useMutation({
		mutationFn: (postId) => deletePost(postId),
		onSuccess: () => {
			toast.success("Đã xóa bài viết.");
			// Cập nhật lại cache list
			queryClient.invalidateQueries(["posts"]);
			queryClient.invalidateQueries(["posts", "my"]);
			// Quay lại MyPosts nếu có quyền, còn không thì về All
			if (role === Role.ADMIN || role === Role.CREATOR) {
				navigate("/blog/my");
			} else {
				navigate("/blog/all");
			}
		},
		onError: (err) => {
			console.error(err);
			toast.error(err?.message || "Không thể xóa bài viết.");
		},
	});

	const handleDelete = () => {
		if (!canDelete) return;
		if (!window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;
		deletePostMutate(id);
	};

	if (loading) return <p className="p-4">Loading...</p>;
	if (!post) return <p className="p-4">Không tìm thấy bài viết.</p>;

	const title = post.title;
	const topics = Array.isArray(post.topics) ? post.topics : [];
	// ===== META: tác giả + ngày =====
	const authorName =
		(typeof post.author === "string" ? post.author : post.author?.name) ??
		post.author_name ??
		"Ẩn danh";

	const rawDate = post.publishedAt || post.createdAt;
	const displayDate = rawDate
		? new Date(rawDate).toLocaleDateString("vi-VN")
		: null;

	const showMetaCard =
		!!authorName || topics.length > 0 || canEdit || canDelete;
	return (
		<div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
			{/* 12 cột: 3 trái (chuyên mục) - 6 giữa (bài viết) - 3 phải (actions + TOC) */}
			<div className="grid grid-cols-12 gap-8">
				{/* Nội dung bài viết */}
				<div className="col-span-9">
					<div className="mb-4">
						<Link
							to="/blog/all"
							className="text-blue-600 hover:underline">
							← Quay lại
						</Link>
					</div>

					<h1 className="mt-2 text-3xl font-extrabold">{title}</h1>

					<article
						className="mt-6 leading-7 text-gray-800 prose max-w-none"
						dangerouslySetInnerHTML={{
							__html: contentHtml || post.content || "",
						}}
					/>
				</div>

				{/* Cột phải: Tác giả + Chủ đề + Quản lý bài viết + TOC */}
				<div className="col-span-3">
					<div className="sticky top-16 space-y-4">
						{showMetaCard && (
							<div className="bg-white rounded-lg shadow p-4 space-y-4">
								{/* Tác giả */}
								<div className="flex items-center gap-3">
									<Avatar
										url={post.author?.avatarUrl}
										size="small"
									/>
									<div className="flex flex-col">
										<span className="text-sm font-semibold text-gray-900">
											{authorName}
										</span>
										{displayDate && (
											<span className="text-xs text-gray-500">
												{displayDate}
											</span>
										)}
									</div>
								</div>

								{/* Chủ đề của bài viết */}
								{!!topics.length && (
									<div>
										{/* Hàng 1: label */}
										<p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
											Chủ đề
										</p>

										{/* Hàng 2: list topic */}
										<div className="flex flex-wrap gap-1.5">
											{topics.map((t) => (
												<Link
													key={
														t.id ?? t.slug ?? t.name
													}
													to={
														t.slug
															? `/topics/${t.slug}`
															: "#"
													}
													className="text-[11px] font-semibold tracking-widest uppercase
                     bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
													{t.name}
												</Link>
											))}
										</div>
									</div>
								)}

								{/* Quản lý bài viết */}
								{(canEdit || canDelete) && (
									<div className="pt-3 border-t border-gray-100">
										<div className="flex items-center justify-between">
											<span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
												Quản lý bài viết
											</span>

											<div className="flex gap-2">
												{canEdit && (
													<Link
														to={`/posts/${id}/edit`}
														className="p-2 rounded-full border border-blue-200 text-blue-600
                               hover:bg-blue-50 hover:border-blue-300 transition inline-flex"
														title="Chỉnh sửa bài viết">
														<Pencil size={18} />
													</Link>
												)}

												{canDelete && (
													<button
														type="button"
														onClick={handleDelete}
														disabled={isDeleting}
														title="Xóa bài viết"
														className="p-2 rounded-full border border-red-200 text-red-600
                               hover:bg-red-50 hover:border-red-300 transition
                               disabled:opacity-60 inline-flex disabled:cursor-not-allowed">
														<Trash size={18} />
													</button>
												)}
											</div>
										</div>
									</div>
								)}
							</div>
						)}

						{toc.length > 0 && (
							<aside className="bg-white rounded-lg shadow p-4 pr-0 mt-4">
								<h3 className="text-sm font-semibold text-gray-700 mb-3">
									Mục lục
								</h3>
								<ul className="space-y-1 text-sm max-h-[36vh] scroll-container pr-4">
									{toc.map((item) => (
										<li
											key={item.id}
											className={
												item.level === "h3"
													? "ml-3"
													: ""
											}>
											<a
												href={`#${item.id}`}
												className="text-gray-600 hover:text-blue-600">
												{item.text}
											</a>
										</li>
									))}
								</ul>
							</aside>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
