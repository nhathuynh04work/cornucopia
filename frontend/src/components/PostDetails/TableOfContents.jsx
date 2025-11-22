import { Hash } from "lucide-react";

export default function TableOfContents({ headings }) {
	const handleScrollTo = (e, id) => {
		e.preventDefault();
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	if (!headings || headings.length === 0) return null;

	return (
		<div className="sticky top-24">
			<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
				<Hash className="w-3 h-3" /> In this article
			</h3>

			<nav className="flex flex-col border-l max-h-[calc(100vh-200px)] overflow-y-auto">
				{headings.map((heading) => (
					<a
						key={heading.id}
						href={`#${heading.id}`}
						onClick={(e) => handleScrollTo(e, heading.id)}
						className={`text-sm py-1.5 pl-4 transition-colors block truncate relative
                            ${
								heading.level === 3
									? "text-gray-400 pl-6 hover:text-purple-600"
									: "text-gray-600 font-medium hover:text-purple-700"
							}
                            hover:border-l-2 hover:!border-purple-500 hover:-ml-[1px]
                        `}>
						{heading.text}
					</a>
				))}
			</nav>
		</div>
	);
}
