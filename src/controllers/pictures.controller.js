import { responseSuccess } from "../common/helpers/response.helper.js";
import { picturesService } from "../services/pictures.service.js";

export const picturesController = {
  // home page
  listPictures: async (req, res, next) => {
    try {
      const result = await picturesService.listPictures(req);
      const response = responseSuccess(
        result,
        `Get all picturess successfully`
      );
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },

  searchByName: async (req, res, next) => {
    try {
      const result = await picturesService.searchByName(req);
      const response = responseSuccess(
        result,
        `Found ${result.length} results for you`
      );
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },

  // Detail page
  // - Lấy thông tin hình ảnh: hình + tác giả + comment + tag theo id hình
  getInfoPicture: async (req, res, next) => {
    try {
      const result = await picturesService.getInfoPicture(req);
      const response = responseSuccess(result, `Get Info Picture Successfully`);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },

  // - Check hình ảnh đã lưu bởi user đang đăng nhập? --> có protect
  checkSavedStatus: async (req, res, next) => {
    try {
      const result = await picturesService.checkSavedStatus(req);
      const response = responseSuccess(
        result,
        `Check saved status successfully`
      );
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },

  // thêm bình luận
  postComment: async (req, res, next) => {
    try {
      const result = await picturesService.postComment(req);
      const response = responseSuccess(result, `Post Comment successfully`);
      res.status(response.code).json(response);
    } catch (err) {
      next(err);
    }
  },
};
