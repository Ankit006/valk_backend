import multer from "multer";
import { multerUpload } from "../utils/multerDisk.js";

export function fileUpload(req, res, next) {
    multerUpload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred (e.g., file too large)
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(500).json({ error: err.message || "There is an issue in server" });
        }
        console.log("ok")
        next()
    })
}