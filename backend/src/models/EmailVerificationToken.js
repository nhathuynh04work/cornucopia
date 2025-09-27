import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

const EmailVerificationToken = sequelize.define(
	"EmailVerificationToken",
	{
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true, // one token per user
			references: { model: "users", key: "id" },
			onDelete: "CASCADE",
		},
		token: { type: DataTypes.STRING(255), allowNull: false, unique: true },
		expires_at: { type: DataTypes.DATE, allowNull: false },
		used: { type: DataTypes.BOOLEAN, defaultValue: false },
	},
	{
		tableName: "email_verification_tokens",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);

export default EmailVerificationToken;
