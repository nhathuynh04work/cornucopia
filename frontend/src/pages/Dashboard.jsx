import { useAuth } from "@/contexts/AuthContext";
import { useGetDashboardOverallStats } from "@/hooks/useDashboardQuery";
import { Loader2, AlertCircle } from "lucide-react";
import { Role } from "@/lib/constants";
import CreatorDashboard from "@/components/Dashboard/CreatorDashboard/CreatorDashboard";
import UserDashboard from "@/components/Dashboard/UserDashboard/UserDashboard";
import AdminDashboard from "@/components/Dashboard/AdminDashboard.jsx/AdminDashboard";

function Dashboard() {
	const { role } = useAuth();

	const { data, isPending, isError, error } = useGetDashboardOverallStats();

	if (isPending) {
		return (
			<div className="min-h-[80vh] flex items-center justify-center">
				<Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
				<div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4 text-red-500">
					<AlertCircle className="w-8 h-8" />
				</div>
				<h2 className="text-xl font-bold text-gray-900 mb-2">
					Không thể tải dữ liệu Dashboard
				</h2>
				<p className="text-gray-500 max-w-md">
					{error?.message ||
						"Đã có lỗi xảy ra. Vui lòng thử lại sau."}
				</p>
			</div>
		);
	}

	if (role === Role.ADMIN) {
		return <AdminDashboard initialStats={data} />;
	}

	if (role === Role.CREATOR) {
		return <CreatorDashboard initialStats={data} />;
	}

	return <UserDashboard initialStats={data} />;
}

export default Dashboard;
