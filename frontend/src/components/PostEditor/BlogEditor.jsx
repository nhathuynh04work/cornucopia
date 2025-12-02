import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Footer from "@/layouts/Footer";
import { useUpdatePost } from "@/hooks/usePostMutation";
import { useEditorAutoSave } from "@/hooks/useEditorAutoSave";
import EditorHeader from "./EditorHeader";
import TitleInput from "./TitleInput";
import RichTextEditor from "./RichTextEditor";
import EditorSidebar from "./EditorSidebar";

export default function BlogEditor({ post }) {
	const postId = post.id;
	const { mutate: updatePost, isPending: isSaving } = useUpdatePost();
	const [lastSaved, setLastSaved] = useState(null);

	const {
		register,
		control,
		setValue,
		watch,
		getValues,
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

	useEffect(() => {
		register("coverUrl");
	}, [register]);

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

	useEditorAutoSave(
		() => {
			const currentData = getValues();

			updatePost(
				{
					postId,
					payload: formatPayload(currentData),
				},
				{
					onSuccess: (updatedPost) => {
						const currentCover = getValues("coverUrl");
						if (
							updatedPost.coverUrl &&
							currentCover !== updatedPost.coverUrl &&
							currentCover.includes("/tmp/")
						) {
							setValue("coverUrl", updatedPost.coverUrl);
						}

						reset(getValues());
						setLastSaved(new Date());
					},
				}
			);
		},
		watch(),
		1000,
		isDirty
	);

	return (
		<form className="min-h-screen flex flex-col bg-white">
			<EditorHeader
				control={control}
				watch={watch}
				isDirty={isDirty}
				isSaving={isSaving}
				lastSaved={lastSaved}
				postId={postId}
			/>

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
					/>
				</main>
				<Footer />
			</div>
		</form>
	);
}
