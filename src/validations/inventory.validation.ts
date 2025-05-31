import * as yup from "yup";
import { ObjectId } from "mongoose";

export const vehicleDetailSchema = yup.object().shape({
	chassis_number: yup.string().required("Chassis number is required"),
	engine_number: yup.string().required("Engine number is required"),
	license_plate: yup.string().required("License plate is required"),
	bpkb_number: yup.string().required("BPKB number is required"),
});

export const inventorySchema = yup.object().shape({
	code: yup.string().optional(),
	name: yup.string().required("Name is required"),
	brand: yup.string().required("Brand is required"),
	type: yup.string().oneOf(["medic", "non_medic", "vehicle"]).required("Type is required"),
	material: yup.string().optional(),
	year: yup.number().min(1900, "Year too early").max(new Date().getFullYear(), "Year cannot be in the future").required("Year is required"),
	quantity: yup.number().min(1, "Quantity must be at least 1").required("Quantity is required"),
	condition: yup.string().oneOf(["good", "fair", "damaged"]).required("Condition is required"),
	mutationRemarks: yup.string().optional(),
	room: yup.string().when("type", {
		is: "vehicle",
		then: () => yup.string().notRequired(),
		otherwise: () => yup.string().required("Room is required"),
	}),
	image: yup.string().required("Image is required"),

	vehicle_details: yup.mixed().when("type", {
		is: "vehicle",
		then: () => vehicleDetailSchema.required(),
		otherwise: () => yup.mixed().notRequired(),
	}),
});

type InventoryType = yup.InferType<typeof inventorySchema>;

export type Inventory = Omit<InventoryType, "room"> & {
	room: ObjectId;
};
