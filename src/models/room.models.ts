import mongoose from "mongoose";
import { Room } from "../validations/room.validation";

const ROOM_MODEL_NAME = "Rooms";

// schema room
const Schema = mongoose.Schema;

// model room
const RoomSchema = new Schema<Room>(
	{
		name: { type: Schema.Types.String, required: true },
		createdBy: { type: Schema.Types.ObjectId, ref: "Users", required: true },
		updatedBy: { type: Schema.Types.ObjectId, ref: "Users", required: true },
	},
	{ timestamps: true }
);

const RoomModel = mongoose.model<Room>(ROOM_MODEL_NAME, RoomSchema);

export default RoomModel;
