import { DataTypes } from "sequelize";
import { sequelize } from "../db/db.js";

const Media = sequelize.define(
	"Media",
	{
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		s3_key: { type: DataTypes.TEXT, allowNull: false },
		file_type: { type: DataTypes.TEXT, allowNull: false },
		status: {
			type: DataTypes.STRING(20),
			allowNull: false,
			defaultValue: "temporary",
		},
		user_id: {
			type: DataTypes.INTEGER,
			references: { model: "users", key: "id" },
		},
	},
	{
		tableName: "media",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
	}
);

export default Media;
