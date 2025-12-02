import CoverImage from "./CoverImage";
import ExcerptInput from "./ExcerptInput";
import TagsInput from "./TagsInput";

export default function EditorSidebar({ register, setValue, watch }) {
	const coverUrl = watch("coverUrl");

	return (
		<aside className="hidden lg:block h-full">
			<div className="sticky top-[80px] space-y-8">
				<CoverImage
					url={coverUrl}
					onChange={(url) =>
						setValue("coverUrl", url, { shouldDirty: true })
					}
				/>

				<div className="w-full h-px bg-gray-100" />

				<ExcerptInput register={register} watch={watch} />
				<TagsInput register={register} watch={watch} />
			</div>
		</aside>
	);
}
