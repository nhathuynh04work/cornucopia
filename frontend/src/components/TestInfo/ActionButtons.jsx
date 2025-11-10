import { useAuth } from "@/contexts/AuthContext";
import { Play, Edit } from "lucide-react";
import NavButton from "../NavButton";

function ActionButtons({ test }) {
	const { user, role } = useAuth();
	const isArchived = test.status === "ARCHIVED";

	return (
		<div className="flex gap-4 px-6 mt-6">
			{isArchived ? (
				<p className="text-sm text-red-600">
					This test is archived and cannot be attempted.
				</p>
			) : user ? (
				<NavButton
					to={`/tests/${test.id}/attempt`}
					className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">
					<Play className="w-4 h-4" />
					Take Test
				</NavButton>
			) : (
				<NavButton
					to="/login"
					className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 border !border-purple-300 rounded-md hover:bg-purple-200">
					<Play className="w-4 h-4" />
					Log in to Take Test
				</NavButton>
			)}

			{role === "admin" && (
				<NavButton
					to={`/tests/${test.id}/edit`}
					className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 border !border-purple-300 rounded-md hover:bg-purple-200">
					<Edit className="w-4 h-4" />
					Edit
				</NavButton>
			)}
		</div>
	);
}

export default ActionButtons;
