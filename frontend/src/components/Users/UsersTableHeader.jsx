export default function UsersTableHeader() {
	return (
		<thead className="bg-gray-50">
			<tr className="border-b border-gray-200 text-left text-sm text-gray-600">
				<th className="py-3 px-4 w-12 text-center font-medium">#</th>
				<th className="py-3 px-4 w-48 font-medium">Name</th>
				<th className="py-3 px-4 w-64 font-medium">Email</th>
				<th className="py-3 px-4 w-36 font-medium">Role</th>
				<th className="py-3 px-4 w-40 font-medium">Register Date</th>
			</tr>
		</thead>
	);
}
