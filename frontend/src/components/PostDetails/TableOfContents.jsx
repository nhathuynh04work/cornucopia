import { List } from "lucide-react";
import { useEffect, useState } from "react";

export default function TableOfContents({ headings }) {
	const [activeId, setActiveId] = useState("");

	useEffect(() => {
		if (!headings?.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				});
			},
			{ rootMargin: "0px 0px -80% 0px" }
		);

		headings.forEach(({ id }) => {
			const el = document.getElementById(id);
			if (el) observer.observe(el);
		});

		return () => observer.disconnect();
	}, [headings]);

	const handleScrollTo = (e, id) => {
		e.preventDefault();
		const element = document.getElementById(id);

		if (element) {
			const offset = 80;
			const top =
				element.getBoundingClientRect().top + window.scrollY - offset;

			window.scrollTo({ top, behavior: "smooth" });
		}
	};

	if (!headings?.length) return null;

	return (
		<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-8">
			<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
				<List className="w-4 h-4" /> Mục lục
			</h3>
			<nav className="relative flex flex-col gap-1 max-h-[60vh] scroll-container pr-2 -mr-2">
				{/* Track line */}
				<div className="absolute left-0 top-2 bottom-2 w-[2px] bg-gray-100 rounded-full" />

				{headings.map(({ id, text, level }) => {
					const isActive = activeId === id;

					return (
						<a
							key={id}
							href={`#${id}`}
							onClick={(e) => handleScrollTo(e, id)}
							className={`
                                relative block text-sm py-1.5 pr-2 transition-colors duration-200
                                ${
									isActive
										? "text-purple-700 font-medium"
										: "text-gray-600 hover:text-gray-900"
								}
                                ${level === 3 ? "pl-8" : "pl-4"}
                            `}>
							{/* Active Indicator */}
							{isActive && (
								<div className="absolute left-0 top-1 bottom-1 w-[2px] bg-purple-600 rounded-full" />
							)}
							{text}
						</a>
					);
				})}
			</nav>
		</div>
	);
}
