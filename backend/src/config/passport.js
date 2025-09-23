import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "../config/env.js";
import {
	getGoogleOAuthAccount,
	linkOAuthAccount,
} from "../repositories/auth.repository.js";
import {
	activateUser,
	createUser,
	getUserByEmail,
	getUserById,
} from "../repositories/user.repository.js";
import db from "../db/db.js";
import { assignRoleToUser } from "../repositories/role.repository.js";

passport.use(
	new GoogleStrategy(
		{
			clientID: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			callbackURL: `${env.API_URL}/auth/google/callback`,
		},
		async (accessToken, refreshToken, profile, done) => {
			const client = await db.connect();
			try {
				await client.query("BEGIN");

				const googleId = profile.id;
				const email = profile.emails?.[0]?.value;
				const name = profile.displayName;

				let user = await getGoogleOAuthAccount(googleId);

				if (!user) {
					user = await getUserByEmail(email);

					if (!user) {
						user = await createUser(client, {
							name,
							email,
							is_active: true,
						});
						await activateUser(client, { userId: user.id });
						await assignRoleToUser(client, {
							userId: user.id,
							role: "user",
						});
					}

					await linkOAuthAccount(client, {
						userId: user.id,
						provider: "google",
						providerId: googleId,
					});
				}

				await client.query("COMMIT");
				return done(null, user);
			} catch (err) {
				await client.query("ROLLBACK");
				return done(err, null);
			} finally {
				client.release();
			}
		}
	)
);

// Serialize/deserialize (needed if you use sessions)
passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	const user = await getUserById(id);
	done(null, user);
});

export default passport;
