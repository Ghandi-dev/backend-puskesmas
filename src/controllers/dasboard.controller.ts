import InventoryModel from "../models/inventory.model";
import { IReqUser } from "../utils/interface";
import response from "../utils/response";
import { Request, Response } from "express";

const getDashboard = async (req: IReqUser, res: Response) => {
	try {
		const [byCondition, byType, total] = await Promise.all([
			InventoryModel.aggregate([{ $group: { _id: "$condition", count: { $sum: 1 } } }]),
			InventoryModel.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]),
			InventoryModel.countDocuments({}),
		]);

		const formatToObject = (arr: any) =>
			arr.reduce((acc: any, cur: any) => {
				acc[cur._id || "Tidak diketahui"] = cur.count;
				return acc;
			}, {});

		const result = {
			total,
			byCondition: formatToObject(byCondition),
			byType: formatToObject(byType),
		};

		return response.success(res, result, "success get dashboard data");
	} catch (error) {
		return response.error(res, error, "Failed to get dashboard data");
	}
};

export default { getDashboard };
