import {
  INVALID_FILE_FORMAT,
  LIMIT_UNEXPECTED_FILE,
  LIMITED_FILE_SIZE,
  UNIQUE_FIELD_DUPLICATED,
} from "../constant/global.constant.js";
import { responseError } from "./response.helper.js";
import pkg from "jsonwebtoken";
const { TokenExpiredError, JsonWebTokenError } = pkg;

// middleware (4 tham số) cuối cùng server -> bắt lỗi theo chuẩn express
export const handlerError = (err, req, res, next) => {
  console.log(
    "Error(s) occurred while calling the api => err.code: ",
    err.code
  );

  // custom để bắt lỗi chi tiết trả cho FE đúng ý nghĩa lỗi. Chuyển mã lỗi 500 -> 401/403
  // *** LƯU Ý****: lỗi 403 kế thừa lỗi từ 401 nên phải để lỗi 401 trước -> lỗi 403 thì mới bắt chính xác lỗi
  // fix cho trường hợp sai token => 401
  if (err instanceof JsonWebTokenError) {
    err.code = 401;
    err.message = "Invalid token";
  }
  // fix cho trường hợp trả lỗi token hết hạn => 403
  if (err instanceof TokenExpiredError) {
    err.code = 403;
    err.message = "Token expired";
  }

  // Lỗi 500 của Prisma - mã lỗi P2002: req gửi lên có trường UNIQUE bị trùng
  if (err.code === "P2002") {
    err.code = 400;
    err.message = UNIQUE_FIELD_DUPLICATED;
  }

  // Bắt lỗi 500 MulterError
  // file upload vượt quá giới hạn dung lượng
  if (err.code === "LIMIT_FILE_SIZE") {
    err.code = 400;
    err.message = LIMITED_FILE_SIZE;
  }
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    err.code = 400;
    err.message = LIMIT_UNEXPECTED_FILE;
  }

  // File upload sai định dạng cho phép
  if (err.message === INVALID_FILE_FORMAT) {
    err.code = 400;
  }

  const resData = responseError(err.message, err.code);
  res.status(resData.code).json(resData);
};

// tạo 1 class kế thừa class Error
// bắt lỗi kiểm soát được
export class BadRequestError extends Error {
  constructor(message = "BadRequest Error") {
    super(message);
    this.code = 400;
  }
}

export class ForbiddenError extends Error {
  constructor(message = "Forbidden Error") {
    super(message);
    this.code = 403;
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized Error") {
    super(message);
    this.code = 401;
  }
}

export class ConflictError extends Error {
  constructor(message = "Conflict Error") {
    super(message);
    this.code = 409;
  }
}

export class NotFoundError extends Error {
  constructor(message = "Not Found Error") {
    super(message);
    this.code = 404;
  }
}
