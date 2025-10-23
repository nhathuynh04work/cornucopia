function StatusBadge({ type }) {
	const styles = {
		correct: "bg-green-100 text-green-800",
		wrong: "bg-red-100 text-red-800",
		unanswered: "bg-gray-100 text-gray-800",
	};
	const text = {
		correct: "Correct",
		wrong: "Wrong",
		unanswered: "Unanswered",
	};
	return (
		<span
			className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}>
			{text[type]}
		</span>
	);
}

export default StatusBadge;
