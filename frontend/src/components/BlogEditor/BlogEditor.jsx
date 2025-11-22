import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";
import Footer from "@/layouts/Footer";
import { useUpdatePost } from "@/hooks/usePostMutation";
import EditorHeader from "./EditorHeader";
import TitleInput from "./TitleInput";
import RichTextEditor from "./RichTextEditor";
import EditorSidebar from "./EditorSidebar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function BlogEditor({ post }) {
	const postId = post.id;
	const navigate = useNavigate();
	const { mutate: updatePost, isPending: isSaving } = useUpdatePost();

	const {
		register,
		control,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { isDirty, errors },
	} = useForm({
		defaultValues: {
			title: post?.title || "",
			content: post?.content || "",
			excerpt: post?.excerpt || "",
			tags: post?.tags ? post.tags.map((t) => t.name).join(", ") : "",
			coverUrl: post?.coverUrl || "",
			status: post?.status || "DRAFT",
		},
	});

	const formatPayload = (formData) => ({
		title: formData.title,
		content: formData.content,
		excerpt: formData.excerpt,
		coverUrl: formData.coverUrl,
		status: formData.status,
		tags: formData.tags
			? formData.tags
					.split(",")
					.map((t) => t.trim())
					.filter((t) => t.length > 0)
			: [],
	});

	const debouncedSave = useMemo(
		() =>
			debounce((formData) => {
				updatePost(
					{
						postId,
						payload: formatPayload(formData),
					},
					{
						onSuccess: () => {
							reset(formData);
						},
					}
				);
			}, 1000),
		[postId, updatePost, reset]
	);

	useEffect(() => {
		const subscription = watch((formData) => {
			debouncedSave(formData);
		});
		return () => subscription.unsubscribe();
	}, [watch, debouncedSave]);

	const handlePublish = handleSubmit((data) => {
		debouncedSave.cancel();

		const updatedData = { ...data, status: "PUBLIC" };
		const payload = formatPayload(updatedData);

		updatePost(
			{ postId, payload },
			{
				onSuccess: (post) => {
					toast.success("Bài viết đã chuyển sang chế độ CÔNG KHAI!");
					navigate(`/posts/${post.id}`);
				},
			}
		);
	});

	return (
		<form className="min-h-screen flex flex-col bg-white">
			<div className="sticky top-0 z-50 bg-white border-b border-gray-100">
				<EditorHeader
					isDirty={isDirty}
					isSaving={isSaving}
					onPublish={handlePublish}
				/>
			</div>

			<div className="flex-1 relative">
				<main className="max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 p-6 lg:p-8">
					<div className="flex flex-col max-w-3xl mx-auto w-full lg:mx-0 lg:max-w-none">
						<TitleInput register={register} errors={errors} />
						<RichTextEditor
							control={control}
							errors={errors}
							postId={postId}
						/>
					</div>

					<EditorSidebar
						register={register}
						setValue={setValue}
						watch={watch}
						postId={postId}
					/>
				</main>
				<Footer />
			</div>
		</form>
	);
}
