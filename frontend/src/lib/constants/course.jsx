import { Video, FileText, Globe, Archive } from "lucide-react";

export const LESSON_TYPE_OPTIONS = [
	{ value: "VIDEO", label: "Video", icon: <Video className="w-3.5 h-3.5" /> },
	{
		value: "TEXT",
		label: "Bài viết",
		icon: <FileText className="w-3.5 h-3.5" />,
	},
];

export const STATUS_OPTIONS = [
	{
		value: "DRAFT",
		label: "Nháp",
		icon: <FileText className="w-3.5 h-3.5" />,
	},
	{
		value: "PUBLIC",
		label: "Công khai",
		icon: <Globe className="w-3.5 h-3.5" />,
	},
	{
		value: "ARCHIVED",
		label: "Lưu trữ",
		icon: <Archive className="w-3.5 h-3.5" />,
	},
];

export const LEVEL_OPTIONS = [
	{ value: "ALL_LEVELS", label: "Tất cả trình độ" },
	{ value: "BEGINNER", label: "Cơ bản" },
	{ value: "INTERMEDIATE", label: "Trung bình" },
	{ value: "ADVANCED", label: "Nâng cao" },
];

export const LANGUAGE_OPTIONS = [
	{ value: "en", label: "Tiếng Anh" },
	{ value: "zh", label: "Tiếng Trung" },
	{ value: "ja", label: "Tiếng Nhật" },
	{ value: "ko", label: "Tiếng Hàn" },
	{ value: "fr", label: "Tiếng Pháp" },
];

export const PRICE_TIERS = [
	{ value: 0, label: "Miễn phí" },
	{ value: 99000, label: "99.000 ₫" },
	{ value: 199000, label: "199.000 ₫" },
	{ value: 299000, label: "299.000 ₫" },
	{ value: 399000, label: "399.000 ₫" },
	{ value: 499000, label: "499.000 ₫" },
	{ value: 599000, label: "599.000 ₫" },
	{ value: 699000, label: "699.000 ₫" },
	{ value: 799000, label: "799.000 ₫" },
	{ value: 899000, label: "899.000 ₫" },
	{ value: 999000, label: "999.000 ₫" },
	{ value: 1499000, label: "1.499.000 ₫" },
	{ value: 1999000, label: "1.999.000 ₫" },
	{ value: 2499000, label: "2.499.000 ₫" },
	{ value: 2999000, label: "2.999.000 ₫" },
	{ value: 4999000, label: "4.999.000 ₫" },
];

export const EXCERPT_LIMIT = 160;
