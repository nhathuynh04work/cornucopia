import { useState } from "react";
import AdminActivityItem from "./AdminActivityItem";
import DashboardSection from "../DashboardSection";
import Tabs from "../Tabs";

export default function RecentActivity({ activity }) {
	const [activeTab, setActiveTab] = useState("users");
	const { newUsers, newContent } = activity;

	const dataToShow = activeTab === "users" ? newUsers : newContent;
	const type = activeTab === "users" ? "user" : "content";

	const tabs = [
		{ key: "users", label: "New Users" },
		{ key: "content", label: "New Content" },
	];

	return (
		<DashboardSection title="Recent Activity">
			<Tabs
				tabs={tabs}
				activeTab={activeTab}
				onTabChange={setActiveTab}
			/>
			<div className="space-y-3 p-1 pr-2">
				{dataToShow.length > 0 ? (
					dataToShow.map((item) => (
						<AdminActivityItem
							key={item.id}
							item={item}
							type={type}
						/>
					))
				) : (
					<p className="text-gray-500">No recent activity.</p>
				)}
			</div>
		</DashboardSection>
	);
}
