import express from "express";
import { picturesController } from "../controllers/pictures.controller.js";
import protect from "../common/middlewares/protect.middleware.js";

const picturesRouter = express.Router();

// homepage
picturesRouter.get("/get-pictures-list", picturesController.listPictures);
picturesRouter.get("/get-pictures-by-name", picturesController.searchByName);

// Detail page
picturesRouter.get(
  "/get-info-picture-by-picId/:picId",
  picturesController.getInfoPicture
);

picturesRouter.use(protect);
picturesRouter.get(
  "/check-userlogin-saved-picture-by-picId/:picId",
  picturesController.checkSavedStatus
);
picturesRouter.post("/post-comment", picturesController.postComment);

export default picturesRouter;
