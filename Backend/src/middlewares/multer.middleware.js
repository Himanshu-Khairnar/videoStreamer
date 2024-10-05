import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Resolve the destination path
        const uploadPath = path.resolve("./public/temp");
        cb(null, uploadPath); // Use resolved path
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keep original file name
    }
});

export const upload = multer({
    storage,
});
