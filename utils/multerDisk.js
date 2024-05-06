import multer from "multer";
import { v4 as uuid } from "uuid"


const storage = multer.diskStorage({
    destination: async function (req, file, cb) {


        let dest = "uploads/";
        // change store destination based on type
        if (file.mimetype.startsWith('image')) {
            dest += 'images/';
        } else if (file.mimetype.startsWith('video')) {
            dest += 'videos/';
        } else if (file.mimetype.startsWith('audio')) {
            dest += 'audios/';
        }
        cb(null, dest)
    },
    filename: function (req, file, cb) {
        const uniqueFilename = `${uuid()}-${file.originalname}`;
        cb(null, uniqueFilename)
    }
})

export const multerUpload = multer({ storage }).fields([
    { name: "image", maxCount: 5 },
    { name: "video", maxCount: 1 },
    { name: "audio", maxCount: 1 }
]) 