import cron from "node-cron";
import prisma from "../prisma.js";

const SCHEDULE = "0 3 * * *";

export const initCronJobs = () => {
	console.log(
		`Cron jobs scheduled: Running nightly reconciliation at 3:00 AM`
	);

	cron.schedule(SCHEDULE, async () => {
		console.log("Starting nightly data reconciliation...");
		const start = Date.now();

		try {
			// 1. Recalculate Test Attempts Count
			const attemptsUpdate = await prisma.$executeRaw`
                UPDATE tests t
                SET attempts_count = (
                SELECT COUNT(*)::int 
                FROM attempts a 
                WHERE a.test_id = t.id
                )
            `;
			console.log(`Synced attempts_count for ${attemptsUpdate} tests`);

			// 2. Recalculate Test Questions Count
			const questionsUpdate = await prisma.$executeRaw`
                UPDATE tests t
                SET questions_count = (
                SELECT COUNT(*)::int 
                FROM test_items ti 
                WHERE ti.test_id = t.id
                )
            `;
			console.log(`Synced questions_count for ${questionsUpdate} tests`);

			// 3. Recalculate Course Ratings (Count & Average)
			const courseUpdate = await prisma.$executeRaw`
                UPDATE courses c
                SET 
                rating_count = (
                    SELECT COUNT(*)::int 
                    FROM reviews r 
                    WHERE r.course_id = c.id
                ),
                average_rating = COALESCE((
                    SELECT AVG(rating)::float 
                    FROM reviews r 
                    WHERE r.course_id = c.id
                ), 0)
            `;
			console.log(`Synced ratings for ${courseUpdate} courses`);
		} catch (error) {
			console.error("Nightly reconciliation failed:", error);
		} finally {
			const duration = (Date.now() - start) / 1000;
			console.log(`Reconciliation finished in ${duration}s`);
		}
	});
};
