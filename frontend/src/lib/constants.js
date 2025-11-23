export const ACCESS_TOKEN_KEY = "access_token";

export const errorMessage = {
	EXPIRED_TOKEN: "Token expired",
};

export const Role = {
	USER: "USER",
	CREATOR: "CREATOR",
	ADMIN: "ADMIN",
};

export const PERMISSIONS = {
	CREATE_FLASHCARD: [Role.USER, Role.CREATOR, Role.ADMIN],
	CREATE_POST: [Role.USER, Role.CREATOR, Role.ADMIN],
	CREATE_COURSE: [Role.CREATOR, Role.ADMIN],
	CREATE_TEST: [Role.CREATOR, Role.ADMIN],
	MANAGE_USERS: [Role.ADMIN],
};
