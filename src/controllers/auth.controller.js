import { responseSuccess } from "../common/helpers/response.helper.js";
import { authService } from "../services/auth.service.js";

export const authController = {
  register: async (req, res, next) => {
    try {
      const result = await authService.register(req);
      const response = responseSuccess(result, `User registration successful`);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
  login: async (req, res, next) => {
    try {
      const result = await authService.login(req);
      const response = responseSuccess(result, `Login successful`);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const result = await authService.refreshToken(req);
      const response = responseSuccess(result, `refreshToken successful`);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
};
