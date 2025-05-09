import * as yup from "yup";
import { room } from "./room.validation";

export const vehicleDetailSchema = yup.object().shape({
	chassis_number: yup.string().required("Chassis number is required"),
	engine_number: yup.string().required("Engine number is required"),
	license_plate: yup.string().required("License plate is required"),
	bpkb_number: yup.string().required("BPKB number is required"),
});

export const inventorySchema = yup.object().shape({
	code: yup.string().optional(),
	name: yup.string().required("Name is required"),
	type: yup.string().oneOf(["medic", "non_medic", "vehicle"]).required("Type is required"),
	material: yup.string().optional(),
	year: yup.number().min(1900, "Year too early").max(new Date().getFullYear(), "Year cannot be in the future").required("Year is required"),
	quantity: yup.number().min(1, "Quantity must be at least 1").required("Quantity is required"),
	condition: yup.string().oneOf(["good", "fair", "damaged"]).required("Condition is required"),
	mutationRemarks: yup.string().optional(),
	room: room,

	vehicle_details: yup.mixed().when("type", {
		is: "vehicle",
		then: () => vehicleDetailSchema.required(),
		otherwise: () => yup.mixed().notRequired(),
	}),
});

export type Inventory = yup.InferType<typeof inventorySchema>;
