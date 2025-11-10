import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router";

function Dashboard() {
	const { user, isInitialLoading } = useAuth();

	if (isInitialLoading) return <Loader2 />;

	if (!user) {
		return <Navigate to="/landing" />;
	}

	return <div>dashboard</div>;
}

export default Dashboard;
