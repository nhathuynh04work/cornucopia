import EnrollmentItem from "./EnrollmentItem";

export default function RecentEnrollments({ enrollments = [] }) {
	return (
		<section>
			<h2 className="text-xl font-semibold text-gray-700 mb-5">
				Recent Enrollments
			</h2>
			{/* No max-h or scrolling, per user request */}
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
		</section>
	);
}
