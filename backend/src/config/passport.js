import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { env } from "../config/env.js";
import prisma from "../prisma.js";
import { Provider } from "../generated/prisma/index.js";

passport.use(
	new GoogleStrategy(
		{
			clientID: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			callbackURL: `${env.API_URL}/auth/google/callback`,
		},
		async (accessToken, refreshToken, profile, done) => {
			const googleId = profile.id;
			const email = profile.emails?.[0]?.value;
			const name = profile.displayName;

			const auth = await prisma.authentication.findUnique({
				where: {
					provider_providerId: {
						provider: Provider.GOOGLE,
						providerId: googleId,
					},
				},
				include: { user: true },
			});
			let user = auth?.user;

			if (!user) {
				user = await prisma.user.findUnique({
					where: { email },
				});

				await prisma.$transaction(async (tx) => {
					if (!user) {
						user = await prisma.user.create({
							data: {
								name,
								email,
								isActive: true,
							},
						});
					}

					await prisma.authentication.create({
						data: {
							userId: user.id,
							provider: Provider.GOOGLE,
							providerId: googleId,
						},
					});
				});
			}

			return done(null, user);
		}
	)
);

// Serialize/deserialize (needed if you use sessions)
passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	const user = await prisma.user.findUnique({ where: { id: id } });
	done(null, user);
});

export default passport;
