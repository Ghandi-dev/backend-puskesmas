import { ObjectId } from "mongoose";
import * as yup from "yup";

export const roomSchema = yup.object().shape({
	name: yup.string().required("Name is required"),
	createdBy: yup.string().required("Created by is required"),
	updatedBy: yup.string().required("Updated by is required"),
});

type RoomType = yup.InferType<typeof roomSchema>;
export type Room = Omit<RoomType, "createdBy" | "updatedBy"> & {
	createdBy: ObjectId;
	updatedBy: ObjectId;
};
