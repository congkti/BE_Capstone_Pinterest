import multer from "multer";
import path from "path";
import fs from "fs";
import createUrlPart from "../utils/create-url-part.util.js";
import getDateNowString from "../utils/get-string-date-now.util.js";
import { INVALID_FILE_FORMAT } from "../constant/global.constant.js";

fs.mkdirSync("upload/avatar/", { recursive: true });
fs.mkdirSync("upload/post-images/", { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // check để phân loại thư mục upload file
    if (req.originalUrl.includes("-avatar-")) {
      cb(null, "upload/avatar"); // Lưu vào thư mục upload/avatar
    } else if (req.originalUrl.includes("/add-new-picture")) {
      cb(null, "upload/post-images"); // Lưu vào thư mục upload/post-images (cho các ảnh bài đăng)
    } else {
      cb(null, "upload"); // Lưu vào thư mục upload (cho các ảnh còn lại)
    }
  },

  filename: function (req, file, cb) {
    // console.log("req.body >>1", req.body);
    // console.log("req >>2", req.baseUrl);
    // console.log("req >>3", req.originalUrl);
    // console.log("req.user >>", req.user);
    // console.log("file >>", file);
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

    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    // Tạo tên file theo tiêu đề bài viết
    const uniqueSuffix = !titleAlias
      ? dateString + "-" + Math.round(Math.random() * 1e9)
      : dateString;
    const fileExtention = path.extname(file.originalname);
    const fileName = titleAlias + "_@local-" + uniqueSuffix + fileExtention;
    cb(null, fileName);
    // console.log(fileName);
  },
});

const uploadLocal = multer({
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

export default uploadLocal;
