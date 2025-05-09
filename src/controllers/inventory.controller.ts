import { Request, Response } from "express";
import { IPaginationQuery, IReqUser } from "../utils/interface";
import response from "../utils/response";
import InventoryModel from "../models/inventory.model";
import { inventorySchema } from "../validations/inventory.validation";

const create = (req: IReqUser, res: Response) => {
	try {
		const inventory = req.body;
		inventorySchema.validate(inventory);
		const result = InventoryModel.create(inventory);
		response.success(res, result, "success create inventory");
	} catch (error) {
		response.error(res, error, "failed create inventory");
	}
};

const getAll = async (req: Request, res: Response) => {
	const { page = 1, limit = 10, search } = req.query as unknown as IPaginationQuery;
	try {
		const query = {};
		if (search) {
			Object.assign(query, {
				$or: [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }],
			});
		}
		const result = await InventoryModel.find(query)
			.limit(limit)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.exec();

		const count = await InventoryModel.countDocuments(query);
		response.pagination(
			res,
			result,
			{
				total: count,
				totalPages: Math.ceil(count / limit),
				current: page,
			},
			"success get all inventory"
		);
	} catch (error) {
		response.error(res, error, "failed to get all inventory");
	}
};

const getById = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const result = await InventoryModel.findById(id);
		response.success(res, result, "success get inventory");
	} catch (error) {
		response.error(res, error, "failed get inventory");
	}
};

const remove = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const result = await InventoryModel.findByIdAndDelete(id);
		response.success(res, result, "success delete inventory");
	} catch (error) {
		response.error(res, error, "failed delete inventory");
	}
};

const update = async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		const inventory = req.body;
		const result = await InventoryModel.findByIdAndUpdate(id, inventory, { new: true });
		response.success(res, result, "success update inventory");
	} catch (error) {
		response.error(res, error, "failed update inventory");
	}
};

export { create, getAll, getById, remove, update };
