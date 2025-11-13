import React from "react";
import AttemptHistoryCard from "./AttemptHistoryCard";

const scrollbarClasses =
	"scrollbar-thin scrollbar-thumb-transparent hover:scrollbar-thumb-purple-300 scrollbar-track-transparent scrollbar-thumb-rounded-full";

export default function RecentTestAttempts({ attempts = [] }) {
	return (
		<section>
			<h2 className="text-xl font-semibold text-gray-700 mb-5">
				Recent Test Attempts
			</h2>
			<div
				className={`space-y-3 max-h-64 overflow-y-auto p-1 pr-2 ${scrollbarClasses}`}>
				{attempts.length > 0 ? (
					attempts.map((attempt) => (
						<AttemptHistoryCard
							key={attempt.id}
							attempt={attempt}
						/>
					))
				) : (
					<p className="text-gray-500 text-sm p-2">
						You haven't attempted any tests yet.
					</p>
				)}
			</div>
		</section>
	);
}
