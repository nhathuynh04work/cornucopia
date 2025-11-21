import AttemptHistoryItem from "@/components/TestInfo/AttemptHistoryItem";
import DashboardSection from "../DashboardSection";

export default function RecentTestAttempts({ attempts = [] }) {
	return (
		<DashboardSection title="Recent Test Attempts">
			<div className="space-y-3 p-1 pr-2">
				{attempts.length > 0 ? (
					attempts.map((attempt) => (
						<AttemptHistoryItem
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
		</DashboardSection>
	);
}
