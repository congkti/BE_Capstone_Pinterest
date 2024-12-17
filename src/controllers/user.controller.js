import { responseSuccess } from "../common/helpers/response.helper.js";
import { userService } from "../services/user.service.js";

export const userController = {
  getUserInfo: async (req, res, next) => {
    try {
      const result = await userService.getUserInfo(req);
      const response = responseSuccess(
        result,
        `Get user #${req.user.user_id} successfully`
      );
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },

  listPictureSavedByUser: async (req, res, next) => {
    try {
      const result = await userService.listPictureSavedByUser(req);
      const response = responseSuccess(
        result,
        `Get Saved Pictures of user #${req.user.user_id} successfully`
      );
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },

  listPicturesCreatedByUser: async (req, res, next) => {
    try {
      const result = await userService.listPicturesCreatedByUser(req);
      const response = responseSuccess(
        result,
        `Get Created Pictures of user #${req.user.user_id} successfully`
      );
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },

  deletePiture: async (req, res, next) => {
    try {
      const result = await userService.deletePiture(req);
      const response = responseSuccess(
        result,
        `Deleted picture #${req.params.picId} successfully`
      );
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },

  postNewPicture: async (req, res, next) => {
    try {
      const result = await userService.postNewPicture(req);
      const response = responseSuccess(result, `Add new picture successfully`);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },

  checkAvailableUserName: async (req, res, next) => {
    try {
      const result = await userService.checkAvailableUserName(req);
      const response = responseSuccess(result, `Check username successfully`);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },

  updateUserInfo: async (req, res, next) => {
    try {
      const result = await userService.updateUserInfo(req);
      const response = responseSuccess(result, `Update User info successfully`);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
};
