export default function TitleInput({ register, errors }) {
	const { ...rest } = register("title", { required: true });

	return (
		<div className="mb-6">
			<textarea
				{...rest}
				placeholder="Tiêu đề bài viết..."
				rows={1}
				className="w-full text-4xl md:text-5xl font-semibold text-gray-900 placeholder:text-gray-300 border-none focus:ring-0 resize-none bg-transparent overflow-hidden leading-tight p-0 field-sizing-content"
			/>
			{errors.title && (
				<span className="text-red-500 text-sm">
					Tiêu đề là bắt buộc
				</span>
			)}
		</div>
	);
}
