import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

function Dashboard() {
	const { user, isInitialLoading } = useAuth();

	if (isInitialLoading) return <Loader2 />;

	if (!user) return <Navigate to="/" />;

	return <div>dashboard</div>;
}

export default Dashboard;
