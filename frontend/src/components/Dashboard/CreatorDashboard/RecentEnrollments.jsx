import DashboardSection from "../DashboardSection";
import EnrollmentItem from "./EnrollmentItem";

export default function RecentEnrollments({ enrollments = [] }) {
	return (
		<DashboardSection title="Recent Enrollments">
			<div className="space-y-3 p-1 pr-2">
				{enrollments.length > 0 ? (
					enrollments.map((item) => (
						<EnrollmentItem key={item.id} enrollment={item} />
					))
				) : (
					<p className="text-gray-500 text-sm p-2">
						No recent enrollments.
					</p>
				)}
			</div>
		</DashboardSection>
	);
}
