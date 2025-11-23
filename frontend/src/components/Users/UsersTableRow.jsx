import { formatVNDate } from "@/lib/formatters";
import ChangeRoleDropdown from "./ChangeRoleDropdown";

export default function UsersTableRow({ user, index, page }) {
	return (
		<tr
			className={`group h-14 border-b border-gray-100 ${
				index % 2 === 0 ? "bg-white" : "bg-gray-50"
			} hover:bg-gray-100 transition-colors`}>
			<td className="px-4 text-sm text-gray-500 text-center">
				{(page - 1) * 10 + index + 1}
			</td>
			<td className="px-4 text-sm text-gray-900">{user.name}</td>
			<td className="px-4 text-sm text-gray-900">{user.email}</td>
			<td className="px-4 text-sm text-gray-900">
				<ChangeRoleDropdown user={user} />
			</td>
			<td className="px-4 text-sm text-gray-900">
				{formatVNDate(user.createdAt)}
			</td>
		</tr>
	);
}
