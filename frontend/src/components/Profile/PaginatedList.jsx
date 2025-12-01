import { useState } from "react";
import { Layers } from "lucide-react";
import EmptyState from "@/components/Shared/EmptyState";
import PaginationControl from "@/components/Shared/PaginationControl";

export default function PaginatedList({
	items,
	renderItem,
	itemsPerPage = 5,
	emptyMessage,
}) {
	const [currentPage, setCurrentPage] = useState(1);

	// Reset page if data changes significantly
	if (items.length > 0 && (currentPage - 1) * itemsPerPage >= items.length) {
		setCurrentPage(1);
	}

	const totalPages = Math.ceil(items.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

	if (items.length === 0) {
		return <EmptyState message={emptyMessage} icon={Layers} />;
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4">
				{currentItems.map((item) => (
					<div
						key={item.id}
						className="w-full relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
						{renderItem(item)}
					</div>
				))}
			</div>

			<PaginationControl
				currentPage={currentPage}
				totalPages={totalPages}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
}
