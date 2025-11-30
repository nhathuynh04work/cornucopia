import { BarChart, BookOpen, GraduationCap, Trophy } from "lucide-react";
import { Role } from "../constants";

export const ACCESS_TOKEN_KEY = "access_token";

export const LEVEL_OPTIONS = [
	{ value: "ALL_LEVELS", label: "Tất cả trình độ", icon: BarChart },
	{ value: "BEGINNER", label: "Cơ bản", icon: BookOpen },
	{ value: "INTERMEDIATE", label: "Trung cấp", icon: GraduationCap },
	{ value: "ADVANCED", label: "Nâng cao", icon: Trophy },
];

export const LANGUAGE_OPTIONS = [
	{ value: "ENGLISH", label: "Tiếng Anh" },
	{ value: "JAPANESE", label: "Tiếng Nhật" },
	{ value: "KOREAN", label: "Tiếng Hàn" },
	{ value: "CHINESE", label: "Tiếng Trung" },
	{ value: "FRENCH", label: "Tiếng Pháp" },
	{ value: "SPANISH", label: "Tiếng Tây Ban Nha" },
];

export const PERMISSIONS = {
	CREATE_FLASHCARD: [Role.USER, Role.CREATOR, Role.ADMIN],
	CREATE_POST: [Role.USER, Role.CREATOR, Role.ADMIN],
	CREATE_COURSE: [Role.CREATOR, Role.ADMIN],
	CREATE_TEST: [Role.CREATOR, Role.ADMIN],
	CREATE_DECK: [Role.USER, Role.CREATOR, Role.ADMIN],
	MANAGE_USERS: [Role.ADMIN],
};
