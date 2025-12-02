export const QUERY_KEYS = {
	posts: {
		all: ["posts"],
		lists: () => [...QUERY_KEYS.posts.all, "list"],
		list: (params) => [...QUERY_KEYS.posts.lists(), params],
		details: () => [...QUERY_KEYS.posts.all, "detail"],
		detail: (id) => [...QUERY_KEYS.posts.details(), id],
	},
	users: {
		all: ["users"],
		lists: () => [...QUERY_KEYS.users.all, "list"],
		list: (params) => [...QUERY_KEYS.users.lists(), params],
		details: () => [...QUERY_KEYS.users.all, "detail"],
		detail: (id) => [...QUERY_KEYS.users.details(), id],
		dashboard: ["dashboard-data"],
		landing: ["landing"],
	},
	courses: {
		all: ["courses"],
		lists: () => [...QUERY_KEYS.courses.all, "list"],
		list: (params) => [...QUERY_KEYS.courses.lists(), params],
		details: () => [...QUERY_KEYS.courses.all, "detail"],
		detail: (id) => [...QUERY_KEYS.courses.details(), id],

		infoView: (id, userId) => [
			...QUERY_KEYS.courses.detail(id),
			"info-view",
			userId,
		],
		enrollment: (id, userId) => [
			...QUERY_KEYS.courses.detail(id),
			"enrollment",
			userId,
		],
		edit: (id) => [...QUERY_KEYS.courses.detail(id), "edit"],
		learn: (id) => [...QUERY_KEYS.courses.detail(id), "learn"],
		reviews: (id, params) => [
			...QUERY_KEYS.courses.detail(id),
			"reviews",
			params,
		],
	},
	tests: {
		all: ["tests"],
		lists: () => [...QUERY_KEYS.tests.all, "list"],
		list: (params) => [...QUERY_KEYS.tests.lists(), params],
		attempted: (params) => [
			...QUERY_KEYS.tests.lists(),
			"attempted",
			params,
		],
		details: () => [...QUERY_KEYS.tests.all, "detail"],
		detail: (id) => [...QUERY_KEYS.tests.details(), id],

		info: (id) => [...QUERY_KEYS.tests.detail(id), "info"],
		edit: (id) => [...QUERY_KEYS.tests.detail(id), "edit"],
		attempt: (id) => [...QUERY_KEYS.tests.detail(id), "attempt"],
		history: (id) => [...QUERY_KEYS.tests.detail(id), "history"],
	},
	tags: {
		all: ["tags"],
		lists: () => [...QUERY_KEYS.tags.all, "list"],
		infinite: (search) => [
			...QUERY_KEYS.tags.lists(),
			"infinite",
			{ search },
		],
	},
	decks: {
		all: ["decks"],
		lists: () => [...QUERY_KEYS.decks.all, "list"],
		list: (params) => [...QUERY_KEYS.decks.lists(), params],
		details: () => [...QUERY_KEYS.decks.all, "detail"],
		detail: (id) => [...QUERY_KEYS.decks.details(), id],
	},
	sessions: {
		all: ["sessions"],
		details: () => [...QUERY_KEYS.sessions.all, "detail"],
		detail: (id) => [...QUERY_KEYS.sessions.details(), id],
		summary: (id) => [...QUERY_KEYS.sessions.detail(id), "summary"],
	},
	comments: {
		all: ["comments"],
		lists: () => [...QUERY_KEYS.comments.all, "list"],
		list: (params) => [...QUERY_KEYS.comments.lists(), params],
	},
	dashboard: {
		all: ["dashboard"],
		overall: (userId, role) => [
			...QUERY_KEYS.dashboard.all,
			"overall",
			userId,
			role,
		],
		charts: (role, type, period) => [
			...QUERY_KEYS.dashboard.all,
			"charts",
			role,
			type,
			period,
		],
	},
};
