import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

const UserRole = sequelize.define(
	"UserRole",
	{
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true, // one role per user
			references: { model: "users", key: "id" },
			onDelete: "CASCADE",
		},
		role: { type: DataTypes.STRING(50), allowNull: false },
	},
	{
		tableName: "user_roles",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);

export default UserRole;
