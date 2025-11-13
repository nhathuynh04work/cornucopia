// course should have modules, lessons and progress
export function calculateCourseProgress(course) {
	const lessons = course.modules.flatMap((m) => m.lessons);

	const totalLessons = lessons.length;
	if (!totalLessons) return 0;

	const completedLessons = lessons.filter(
		(l) => l.progress.length && l.progress[0].isCompleted
	).length;

	return Math.round((completedLessons / totalLessons) * 100);
}

export function calculateCurrentStreak(studySessions) {
	if (!studySessions.length) return 0;

	// Get a set of unique day strings
	const studyDaysSet = new Set(
		studySessions.map((s) => s.startTime.toISOString().slice(0, 10))
	);

	let streak = 0;
	const today = new Date();

	// Check consecutive days backwards from today
	for (let i = 0; ; i++) {
		const date = new Date();
		date.setDate(today.getDate() - i);
		const dayStr = date.toISOString().slice(0, 10);

		if (!studyDaysSet.has(dayStr)) break;

		streak++;
	}

	return streak;
}
