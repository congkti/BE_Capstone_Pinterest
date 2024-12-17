import express from "express";
import { PrismaClient } from "@prisma/client";
import prisma from "../common/prisma/init.prisma.js";
import authRouter from "./auth.router.js";
import protect from "../common/middlewares/protect.middleware.js";
import picturesRouter from "./pictures.router.js";
import userRouter from "./user.router.js";

const rootRouter = express.Router();

// tạo một end-point api check server
rootRouter.get("/", (req, res, next) => {
  console.log("Kết nối server thành công");
  res.json("Call api OK");
});

// tạo quản lý các router con...
rootRouter.use("/auth", authRouter);
rootRouter.use("/pictures", picturesRouter);
rootRouter.use("/user", userRouter);

// ====== example create a Api======
rootRouter.get("/users", protect, async (req, res) => {
  const users = await prisma.users.findMany();
  res.json(users);
});

export default rootRouter;
