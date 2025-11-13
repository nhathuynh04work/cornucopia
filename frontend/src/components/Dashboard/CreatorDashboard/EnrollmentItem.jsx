const formatRelativeTime = (date) => {
	const seconds = Math.floor((new Date() - new Date(date)) / 1000);
	let interval = seconds / 31536000;
	if (interval > 1) return Math.floor(interval) + " years ago";
	interval = seconds / 2592000;
	if (interval > 1) return Math.floor(interval) + " months ago";
	interval = seconds / 86400;
	if (interval > 1) return Math.floor(interval) + " days ago";
	interval = seconds / 3600;
	if (interval > 1) return Math.floor(interval) + " hours ago";
	interval = seconds / 60;
	if (interval > 1) return Math.floor(interval) + " minutes ago";
	return "Just now";
};

export default function EnrollmentItem({ enrollment }) {
	return (
		<div className="bg-white p-3 rounded-lg border border-gray-200 text-sm">
			<p className="font-semibold text-gray-800 truncate">
				{enrollment.userName}
			</p>
			<p className="text-gray-600 text-xs truncate">
				enrolled in <strong>{enrollment.courseName}</strong>
			</p>
			<p className="text-gray-500 text-xs">
				{formatRelativeTime(enrollment.date)}
			</p>
		</div>
	);
}
