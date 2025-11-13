import { api } from "@/apis/axios";
import UserDashboard from "@/components/Dashboard/UserDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router";

function Dashboard() {
	const { user, role, isInitialPending } = useAuth();

	const { data, isPending, isError, error } = useQuery({
		queryKey: ["dashboard"],
		queryFn: async () => {
			const res = await api.get("/users/me/dashboard");
			return res.data;
		},
		enabled: !!user,
	});

	if (isInitialPending) return <Loader2 />;

	if (!user) return <Navigate to="/landing" />;

	if (isPending) {
		return (
			<div className="flex flex-col items-center justify-center h-[80vh] text-gray-600">
				<div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
				<p className="text-sm">Loading your dashboard...</p>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center h-[80vh] text-red-600">
				<p className="text-lg font-medium">Something went wrong</p>
				<p className="text-sm text-red-500 mt-1">
					{error?.message || "Unable to fetch dashboard data."}
				</p>
				<button
					onClick={() => window.location.reload()}
					className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
					Retry
				</button>
			</div>
		);
	}

	if (role === Role.ADMIN) return <p>Implement later</p>;
	if (role === Role.CREATOR) return <p>Implement later</p>;

	return <UserDashboard data={data} />;
}

export default Dashboard;
