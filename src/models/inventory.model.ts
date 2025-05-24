import mongoose from "mongoose";
import { Inventory } from "../validations/inventory.validation";

const INVENTORY_MODEL_NAME = "Inventories";

// schema
const Schema = mongoose.Schema;

// Subschema untuk detail kendaraan
const VehicleDetailSchema = new Schema(
	{
		chassis_number: String,
		engine_number: String,
		license_plate: String,
		bpkb_number: String,
	},
	{ _id: false }
); // tidak perlu _id untuk embedded object


const InventorySchema = new Schema<Inventory>({
	code: { type: Schema.Types.String, required: true },
	name: { type: Schema.Types.String, required: true },
	type: { type: Schema.Types.String, enum: ["medic", "non_medic", "vehicle"], required: true },
	material: { type: Schema.Types.String, required: true },
	year: { type: Schema.Types.Number, required: true },
	quantity: { type: Schema.Types.Number, required: true },
	condition: { type: Schema.Types.String, enum: ["good", "fair", "damaged"], required: true },
	mutationRemarks: { type: Schema.Types.String },
	room: { type: Schema.Types.ObjectId, ref: "Room" },
	vehicle_details: {
		type: VehicleDetailSchema,
		required: function () {
			return this.type === "vehicle";
		},
	},
});

const InventoryModel = mongoose.model<Inventory>(INVENTORY_MODEL_NAME, InventorySchema);

export default InventoryModel;
