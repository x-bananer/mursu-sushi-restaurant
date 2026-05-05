import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDir = path.resolve(process.cwd(), "uploads/users");
fs.mkdirSync(uploadDir, { recursive: true });

export const uploadUserPhoto = multer({
	dest: uploadDir,
	limits: { fileSize: 5 * 1024 * 1024 },
}).single("photo");
