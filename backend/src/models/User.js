import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

const User = sequelize.define(
	"User",
	{
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
		name: { type: DataTypes.STRING(255) },
		avatar_url: { type: DataTypes.STRING(255) },
		is_active: { type: DataTypes.BOOLEAN, defaultValue: false },
	},
	{
		tableName: "users",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);

export default User;
