import { useState } from "react";
import AdminActivityItem from "./AdminActivityItem";

export default function RecentActivity({ activity }) {
	const [activeTab, setActiveTab] = useState("users");
	const { newUsers, newContent } = activity;

	const dataToShow = activeTab === "users" ? newUsers : newContent;
	const type = activeTab === "users" ? "user" : "content";

	return (
		<section>
			<h2 className="text-xl font-semibold text-gray-700 mb-5">
				Recent Activity
			</h2>
			<div className="border-b border-gray-200 mb-4">
				<nav className="-mb-px flex space-x-8" aria-label="Tabs">
					<button
						onClick={() => setActiveTab("users")}
						className={
							(activeTab === "users"
								? "border-purple-500 text-purple-600"
								: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300") +
							" whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm"
						}>
						New Users
					</button>
					<button
						onClick={() => setActiveTab("content")}
						className={
							(activeTab === "content"
								? "border-purple-500 text-purple-600"
								: "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300") +
							" whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm"
						}>
						New Content
					</button>
				</nav>
			</div>
			{/* Removed max-h and overflow */}
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
		</section>
	);
}
