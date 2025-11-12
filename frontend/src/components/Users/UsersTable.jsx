import PaginationNav from "./PaginationNav";
import UsersTableHeader from "./UsersTableHeader";
import UsersTableRow from "./UsersTableRow";
import NotFoundRow from "./NotFoundRow";

export default function UsersTable({ data, setPage }) {
	const { users = [], total = 0, page = 1, totalPages = 1 } = data || {};

	const handlePrev = () => {
		if (page > 1) setPage(page - 1);
	};

	const handleNext = () => {
		if (page < totalPages) setPage(page + 1);
	};

	return (
		<div className="w-full overflow-x-auto">
			<div className="overflow-hidden rounded-xl border border-gray-200">
				<table className="w-full table-fixed border-collapse">
					<UsersTableHeader />
					<tbody>
						{users.length > 0 ? (
							users.map((user, index) => (
								<UsersTableRow
									key={user.id}
									user={user}
									index={index}
									page={page}
								/>
							))
						) : (
							<NotFoundRow />
						)}
					</tbody>
				</table>
			</div>

			<PaginationNav
				page={page}
				totalPages={totalPages}
				total={total}
				onPrev={handlePrev}
				onNext={handleNext}
			/>
		</div>
	);
}
