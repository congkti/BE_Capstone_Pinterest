import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from "../common/helpers/error.helper.js";
import prisma from "../common/prisma/init.prisma.js";
import bcrypt from "bcrypt";
import tokenService from "./tokens.service.js";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_SECRET,
  INVALID_USER,
  REFRESH_TOKEN_SECRET,
  USER_IS_BANNED,
} from "../common/constant/global.constant.js";

export const authService = {
  register: async (req) => {
    const { email, password, full_name } = req.body;

    // kiểm tra email có tồn tại trong db?
    const userExits = await prisma.users.findFirst({
      where: {
        email,
      },
    });
    if (userExits)
      throw new ConflictError("Email already exists. Please login!");

    // user ko tồn tại -> tạo newUser
    const newUser = await prisma.users.create({
      data: {
        email,
        full_name,
        password: bcrypt.hashSync(password, 10),
      },
      omit: {
        is_deleted: true,
        created_at: true,
        updated_at: true,
      },
    });

    return newUser;
  },

  login: async (req) => {
    const { email, password } = req.body;

    const userExits = await prisma.users.findFirst({
      where: {
        email,
      },
      omit: {
        password: false,
      },
      // select: {
      //   user_id: true,
      //   password: true,
      // },
    });
    // check email ko tồn tại
    if (!userExits) throw new BadRequestError(INVALID_USER);
    // email tồn tại -> kiểm tra pass
    const dbPass = userExits.password;
    const isPass = bcrypt.compareSync(password, dbPass);
    // check sai pass trả lỗi
    if (!isPass) throw new BadRequestError(INVALID_USER);

    // check user đang bị "ban" hoặc đang chờ xóa
    if (userExits.is_deleted === true)
      throw new UnauthorizedError(USER_IS_BANNED);

    // pass đúng -> tạo token và trả res
    const tokens = tokenService.createTokens(userExits);
    const resUser = { ...userExits };
    delete resUser.password;
    delete resUser.is_deleted;
    delete resUser.created_at;
    delete resUser.updated_at;

    return { ...resUser, ...tokens };
  },

  refreshToken: async (req) => {
    // console.log(req.user);
    const accessToken = req.headers?.authorization?.split(" ")[1];
    const refreshToken = req.headers[`x-ret`];
    // ko có token
    if (!refreshToken) throw new UnauthorizedError();
    if (!accessToken) throw new UnauthorizedError();

    // kiểm tra token truyền lên đúng khóa bảo mật lưu trong env?
    const deAccessToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET, {
      ignoreExpiration: true, //accesstoken ko cần kiểm tra thời hạn
    });
    const deRefreshToken = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    // console.log({ deAccessToken, deRefreshToken });

    // kiểm tra khớp user
    if (deRefreshToken.userId !== deAccessToken.userId)
      throw new UnauthorizedError();

    // tạo tokens mới
    const user = await prisma.users.findFirst({
      where: {
        user_id: deRefreshToken.userId,
      },
    });
    const tokens = tokenService.createTokens(user);

    return tokens;
  },
};
