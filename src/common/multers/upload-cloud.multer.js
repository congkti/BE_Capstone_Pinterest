import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
  CLOUD_NAME,
  INVALID_FILE_FORMAT,
} from "../constant/global.constant.js";
import createUrlPart from "../utils/create-url-part.util.js";
import getDateNowString from "../utils/get-string-date-now.util.js";

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET, // Click 'View API Keys' above to copy your API secret
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // console.log(">>>>", req.body);
    const uprefix = !req.body.userName
      ? "uid" + req.user.user_id
      : req.body.userName;

    const titleAlias = req.body.postTitle
      ? createUrlPart(req.body.postTitle)
      : req.originalUrl.includes("-avatar-")
      ? "avatar-" + uprefix
      : "file-upload";

    const dateString = getDateNowString(new Date());
    // Tạo tên file theo tiêu đề bài viết
    const uniqueSuffix = !titleAlias
      ? dateString + "-" + Math.round(Math.random() * 1e9)
      : dateString;
    // const fileExtention = path.extname(file.originalname);
    // const fileName = titleAlias + "_@" + uniqueSuffix + fileExtention;
    const fileName = titleAlias + "_" + uniqueSuffix; // cloudinary ko cần extention

    if (req.originalUrl.includes("-avatar-")) {
      return {
        folder: "bai-tap/avatar",
        public_id: fileName,
      };
    } else if (req.originalUrl.includes("/add-new-picture")) {
      return {
        folder: "bai-tap/post-images",
        public_id: fileName,
      };
    } else {
      return {
        folder: "upload",
        public_id: fileName,
      };
    }
  },
});

const uploadCloud = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // thay đổi fileSize (MB) => chỉnh lại message trong global.constant.js
  fileFilter: (req, file, cb) => {
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (allowedFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(INVALID_FILE_FORMAT));
    }
  },
  // preservePath: true,
});

export default uploadCloud;
