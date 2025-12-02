import { useState } from "react";
import { useGetTests } from "@/hooks/useTestQuery";
import TestCard from "@/components/Tests/TestCard";
import PaginationControl from "@/components/Shared/PaginationControl";
import EmptyState from "@/components/Shared/EmptyState";
import { FileQuestion, Loader2 } from "lucide-react";

export default function ProfileTestsTab({ userId, searchTerm, sortBy }) {
	const [page, setPage] = useState(1);
	const limit = 10;

	const { data, isLoading } = useGetTests({
		userId,
		search: searchTerm,
		sort: sortBy,
		page,
		limit,
	});

	if (isLoading) {
		return (
			<div className="flex justify-center py-12">
				<Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
			</div>
		);
	}

	const items = data?.data || data || [];
	const pagination =data?.pagination || { totalPages: 1, currentPage: 1 };
	const totalPages = pagination.totalPages || Math.ceil(items.length / limit) || 1;

	if (items.length === 0) {
		return (
			<EmptyState icon={FileQuestion} message="Chưa có bài thi nào." />
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4">
				{items.map((test) => (
					<div
						key={test.id}
						className="w-full relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
						<TestCard test={test} />
					</div>
				))}
			</div>

			{totalPages > 1 && (
				<PaginationControl
					currentPage={page}
					totalPages={totalPages}
					onPageChange={setPage}
				/>
			)}
		</div>
	);
}
