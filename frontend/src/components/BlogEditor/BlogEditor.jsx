import { useForm } from "react-hook-form";
import EditorHeader from "./EditorHeader";
import TitleInput from "./TitleInput";
import RichTextEditor from "./RichTextEditor";
import EditorSidebar from "./EditorSidebar";
import Footer from "@/layouts/Footer";

export default function BlogEditor({ post }) {
	const {
		register,
		control,
		handleSubmit,
		setValue,
		watch,
		formState: { isDirty, errors },
	} = useForm({
		defaultValues: {
			title: post?.title || "",
			content: post?.content || "",
			excerpt: post?.excerpt || "",
			tags: post?.tags ? post.tags.map((t) => t.name).join(", ") : "",
			coverUrl: post?.coverUrl || "",
			isPublished: post?.isPublished || false,
		},
	});

	const onSubmit = (data) => {
		console.log("Form Submitted:", data);
	};

	const handleSaveDraft = handleSubmit((data) => {
		onSubmit({ ...data, isPublished: false });
	});

	const handlePublish = handleSubmit((data) => {
		onSubmit({ ...data, isPublished: true });
	});

	return (
		<form className="h-screen flex flex-col bg-white overflow-hidden">
			<EditorHeader
				isDirty={isDirty}
				onSaveDraft={handleSaveDraft}
				onPublish={handlePublish}
			/>

			<div className="flex-1 overflow-y-auto relative scroll-smooth">
				<main className="w-full mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 p-6 lg:p-8 min-h-full">
					<div className="flex flex-col max-w-3xl mx-auto w-full lg:mx-0 lg:max-w-none">
						{/* Pass register to simple inputs */}
						<TitleInput register={register} errors={errors} />

						{/* Pass control to complex inputs (Tiptap) */}
						<RichTextEditor control={control} errors={errors} />
					</div>

					{/* Pass both for mixed sidebar inputs */}
					<EditorSidebar
						register={register}
						setValue={setValue}
						watch={watch}
						postId={post.id}
					/>
				</main>
				<Footer />
			</div>
		</form>
	);
}
