import { ACCESS_TOKEN_SECRET } from "../constant/global.constant.js";
import { ForbiddenError, UnauthorizedError } from "../helpers/error.helper.js";
import jwt from "jsonwebtoken";
import prisma from "../prisma/init.prisma.js";

const protect = async (req, res, next) => {
  try {
    const accessToken = req.headers?.authorization?.split(" ")[1];
    if (!accessToken)
      throw new UnauthorizedError("Please provide token to use this api");

    const deToken = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
    // check user
    // console.log({ deToken });
    const user = await prisma.users.findUnique({
      where: {
        user_id: deToken.userId,
      },
    });
    //   console.log({ user });
    // user không tồn tại
    if (!user) throw new UnauthorizedError("Invalid user or user not found");

    // cấp thông tin user vào request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default protect;
