import React from "react";

export default function AdminActions() {
	return (
		<section>
			<h2 className="text-xl font-semibold text-gray-700 mb-5">
				Admin Actions
			</h2>
			<div className="space-y-3">
				<button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg text-md">
					Manage Users
				</button>
				<button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg text-md">
					Manage Creators
				</button>
			</div>
		</section>
	);
}
