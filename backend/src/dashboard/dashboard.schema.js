import { z } from "zod";

const TimePeriodSchema = z.enum(["12months", "6months", "3months", "ALL"]);

const AdminChartTypeSchema = z.enum([
	"USER_GROWTH",
	"REVENUE_GROWTH",
	"CONTENT_DISTRIBUTION",
	"TOP_ENROLLED_COURSES",
	"TOP_ATTEMPTED_TESTS",
	"TOP_REVENUE_COURSES",
	"TOP_STUDIED_DECKS",
]);

const CreatorChartTypeSchema = z.enum([
	"MONTHLY_ENGAGEMENT",
	"ENGAGEMENT_BREAKDOWN",
]);

// --- Route Schemas ---

export const getAdminChartDataSchema = {
	query: z.object({
		chartType: AdminChartTypeSchema,
		timePeriod: TimePeriodSchema.optional(),
	}),
};

export const getCreatorChartDataSchema = {
	query: z.object({
		chartType: CreatorChartTypeSchema,
		timePeriod: TimePeriodSchema.optional(),
	}),
};
