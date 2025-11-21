import { Users, ShieldCheck } from "lucide-react";
import DashboardSection from "../DashboardSection";
import { Link } from "react-router";

export default function AdminActions() {
	return (
		<DashboardSection title="Admin Actions">
			<div className="space-y-3">
				{/* Primary Action */}
				<Link
					to="/users"
					className="group w-full bg-purple-600 hover:bg-purple-700 text-white py-3.5 px-4 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-3">
					<Users className="w-5 h-5 text-purple-200 group-hover:text-white transition-colors" />
					Manage Users
				</Link>

				{/* Secondary Action - Cleaner "Outline" Style */}
				<Link
					to="/users/creators"
					className="group w-full bg-white border border-gray-200 hover:border-purple-200 hover:bg-purple-50 text-gray-700 hover:text-purple-700 py-3.5 px-4 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-3">
					<ShieldCheck className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
					Manage Creators
				</Link>
			</div>
		</DashboardSection>
	);
}
