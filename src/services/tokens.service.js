import {
  ACCESS_TOKEN_EXPIRES,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES,
  REFRESH_TOKEN_SECRET,
} from "../common/constant/global.constant.js";
import jwt from "jsonwebtoken";

const tokenService = {
  createTokens: (user) => {
    const acT = jwt.sign({ userId: user.user_id }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES,
    });
    const reT = jwt.sign({ userId: user.user_id }, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES,
    });

    return { acT, reT };
  },
};

export default tokenService;
