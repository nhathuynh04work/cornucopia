export const getLessonIndexMap = (modules) => {
	const map = {};
	let count = 1;
	modules?.forEach((mod) => {
		mod.lessons.forEach((lesson) => {
			map[lesson.id] = count++;
		});
	});
	return map;
};

export const getModuleStats = (module) => {
	const duration = module.lessons.reduce(
		(acc, l) => acc + (l.duration || 0),
		0
	);
	return { count: module.lessons.length, duration };
};

export const getCourseStats = (course) => {
	let totalMinutes = 0;
	let totalLessons = 0;
	course.modules?.forEach((m) => {
		const stats = getModuleStats(m);
		totalMinutes += stats.duration;
		totalLessons += stats.count;
	});

	const hours = Math.floor(totalMinutes / 60);
	const mins = totalMinutes % 60;
	const timeString = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

	return { totalLessons, timeString };
};
