import express from "express";
import httpStatus from "http-status";
import { categoryType } from "../utils/constants.js"
import db from "../database/dbClient.js";
import { eq } from "drizzle-orm";
import { category } from "../database/schema.js";
const router = express.Router();

router.get("/", async (req, res) => {
    const { parentId, type } = req.query;
    try {
        if (type === categoryType.category || !type) {
            const list = await db.query.category.findMany({
                where: eq(category.type, categoryType.category)
            })
            return res.send(list);
        } else {
            const list = await db.query.category.findMany({
                where: (category, { and, eq }) => and(
                    eq(category.parentId, parseInt(parentId)),
                    eq(category.type, type)
                ),
            })
            return res.send(list)
        }
    } catch {
        return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: "There is an issue in server" });
    }

})

export default router;