import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

const Authentication = sequelize.define(
	"Authentication",
	{
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "users", key: "id" },
			onDelete: "CASCADE",
		},
		provider: { type: DataTypes.STRING(50), allowNull: false },
		provider_id: { type: DataTypes.STRING(255) },
		password_hash: { type: DataTypes.STRING(255) },
	},
	{
		tableName: "authentication",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		indexes: [
			{ unique: true, fields: ["provider", "user_id"] },
			{ unique: true, fields: ["provider", "provider_id"] },
		],
	}
);

export default Authentication;
