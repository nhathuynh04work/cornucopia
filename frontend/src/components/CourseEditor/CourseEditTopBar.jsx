import Logo from "@/components/Logo";
import UserMenu from "@/components/UserMenu";

const statusStyles = {
	DRAFT: {
		text: "Draft",
		className: "bg-gray-100 text-gray-800 ring-1 ring-inset ring-gray-200",
	},
	PUBLIC: {
		text: "Public",
		className:
			"bg-green-100 text-green-800 ring-1 ring-inset ring-green-200",
	},
	UNLISTED: {
		text: "Unlisted",
		className: "bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200",
	},
};

export default function CourseEditTopBar({ course }) {
	const currentStatus = statusStyles[course.status] || statusStyles.DRAFT;

	return (
		<header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
			<div className="flex items-center gap-4 min-w-0">
				<Logo />
				<div className="w-px h-6 bg-gray-300 flex-shrink-0" />

				<div className="flex items-center gap-3 min-w-0">
					<h1 className="text-md font-extralight text-gray-600 truncate">
						{course.name}
					</h1>

					<span
						className={`
                            px-2.5 py-0.5 rounded-full text-xs font-semibold
                            flex-shrink-0 ${currentStatus.className}
                        `}>
						{currentStatus.text}
					</span>
				</div>
			</div>

			<UserMenu />
		</header>
	);
}
