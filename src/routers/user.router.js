import express from "express";
import { userController } from "../controllers/user.controller.js";
import protect from "../common/middlewares/protect.middleware.js";
import uploadLocal from "../common/multers/upload-local.multer.js";
import uploadCloud from "../common/multers/upload-cloud.multer.js";

const userRouter = express.Router();

userRouter.use(protect);

userRouter.get("/get-user-info", userController.getUserInfo);
userRouter.get(
  "/list-pictures-saved-by-user-loggedin",
  userController.listPictureSavedByUser
);
userRouter.get(
  "/list-pictures-created-by-userloggedin",
  userController.listPicturesCreatedByUser
);

userRouter.delete("/delete-picture/:picId", userController.deletePiture);

// chọn 1 trong 2 cách upload: cloud hoặc local
userRouter.put(
  `/update-user-info-avatar-local`,
  uploadLocal.single("avatar"),
  userController.updateUserInfo
);
userRouter.put(
  `/update-user-info-avatar-cloud`,
  uploadCloud.single("avatar"),
  userController.updateUserInfo
);

userRouter.post(
  "/add-new-picture-local",
  uploadLocal.single("postPicture"),
  userController.postNewPicture
);
userRouter.post(
  "/add-new-picture-cloud",
  uploadCloud.single("postPicture"),
  userController.postNewPicture
);

userRouter.get(
  "/check-username-available",
  userController.checkAvailableUserName
);

export default userRouter;
