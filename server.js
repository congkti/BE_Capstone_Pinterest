import express from "express";
import cors from "cors";
import corsList from "./src/common/helpers/cors.helper.js";
import rootRouter from "./src/routers/root.router.js";
import { handlerError } from "./src/common/helpers/error.helper.js";

const app = express();

// sử dụng middledware để chuyển JSON sang đối tượng js (object,...)
// sử dụng với body khi truyền dữ liệu
app.use(express.json());

// quản lý chặn cors
app.use(cors({ origin: corsList }));

// thiết lập đường dẫn static cho root để xem đc các file tĩnh trên local
app.use(express.static("."));

// root router
app.use(rootRouter);

// bắt lỗi theo chuẩn express
app.use(handlerError);

// =========[Tạo cổng kết nối cho hệ thống BackEnd của dự án]=========
const PORT = 3070;
app.listen(PORT, () => {
  console.log(`Server online at port ${PORT}`);
});
