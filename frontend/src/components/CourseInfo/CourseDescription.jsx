export default function CourseDescription({ description }) {
	return (
		<div className="animate-in fade-in duration-300">
			<div
				className="prose prose-purple max-w-none 
                    prose-headings:font-bold prose-headings:text-gray-900 
                    prose-p:text-gray-600 prose-p:leading-relaxed 
                    prose-img:rounded-xl prose-img:shadow-sm
                    prose-ul:list-disc prose-ul:pl-5"
				dangerouslySetInnerHTML={{
					__html:
						description ||
						"<p class='text-gray-400 italic text-center py-8'>Chưa có mô tả chi tiết cho khóa học này.</p>",
				}}
			/>
		</div>
	);
}
