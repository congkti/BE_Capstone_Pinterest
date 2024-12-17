import {
  ACCESS_TOKEN_SECRET,
  USER_NAME_NOT_AVAILABLE,
} from "../common/constant/global.constant.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../common/helpers/error.helper.js";
import prisma from "../common/prisma/init.prisma.js";
import path from "node:path";
import cleanString from "../common/utils/clean-string.util.js";

export const userService = {
  // Lấy thông tin của user đã đăng nhập
  getUserInfo: async (req) => {
    // const user = prisma.users.findFirst({
    //   where: {
    //     user_id: req.user.user_id,
    //   },
    //   omit: {
    //     created_at: true,
    //     updated_at: true,
    //   },
    // });

    delete req.user.created_at;
    delete req.user.updated_at;

    return req.user;
  },

  // lấy danh sách ảnh đã lưu theo user đăng nhập
  listPictureSavedByUser: async (req) => {
    const savedPictures = await prisma.save_picture.findMany({
      where: {
        user_id: req.user.user_id,
      },
      include: {
        pictures: {
          omit: {
            created_at: true,
            updated_at: true,
          },
        },
      },
    });
    if (savedPictures.length === 0)
      throw new NotFoundError(
        `User #${userId} has not saved any picture before.`
      );

    const resData = savedPictures.map((item) => ({
      savedUserId: item.user_id,
      savedPicture: {
        save_id: item.save_id,
        save_date: item.save_date,
        ...item.pictures,
      },
    }));

    return resData;
  },

  // lấy dánh sách ảnh đẫ tạo bới user đăng nhập
  listPicturesCreatedByUser: async (req) => {
    const createdPictures = await prisma.pictures.findMany({
      where: {
        user_id: req.user.user_id,
        is_deleted: false,
      },
      select: {
        user_id: true,
        pic_id: true,
        pic_name: true,
        pic_url: true,
        pic_description: true,
        pictures_tags: {
          select: {
            pic_id: true,
            tags: {
              select: {
                tag_id: true,
                tag_name: true,
              },
            },
          },
        },
      },
    });
    if (createdPictures.length === 0)
      throw new NotFoundError(
        `User #${userId} has not created any picture before.`
      );

    const resData = createdPictures.map((item) => ({
      createdUserId: item.user_id,
      createdPicture: {
        pic_id: item.pic_id,
        pic_name: item.pic_name,
        pic_url: item.pic_url,
        pic_description: item.pic_description,
        pic_tags: item.pictures_tags.map((tag) => {
          return {
            id: tag.tags.tag_id,
            name: tag.tags.tag_name,
          };
        }),
      },
    }));

    return resData;
  },

  // xóa ảnh đã tạo theo id ảnh
  deletePiture: async (req) => {
    const picId = +req.params.picId;
    const userId = +req.user.user_id;
    const isExist = await prisma.pictures.findFirst({
      where: { pic_id: picId, user_id: userId },
    });
    if (!isExist)
      throw new ConflictError(
        `Picture #${picId} does not exist. Or user does not have permission to delete this picture.`
      );

    await prisma.pictures.delete({
      where: { pic_id: picId, user_id: userId },
    });

    return null;
  },

  // post hình ảnh mới
  postNewPicture: async (req) => {
    // console.log(req.user);
    // const { pic_name, pic_url, pic_descriptio, user_id } = pictures;
    const file = req.file;
    const { postTitle, postContent } = req.body;
    if (!file || !postTitle || !postContent)
      throw new BadRequestError(
        "No file (Or/And post-title, post-content) in request"
      );
    // console.log(req.file);
    // console.log(req.body);
    // console.log(req.user);
    // console.log(req.originalUrl);

    // check là local hay cloud
    // const isImgLocal = req.user.avatar?.includes("@local");

    const arrPath = file.path?.split(path.sep);
    const imgUrl = arrPath?.join("/");
    // const imgUrl = file.path.replaceAll(path.sep, "/"); // ES2021

    const newPicture = await prisma.pictures.create({
      data: {
        pic_name: postTitle,
        pic_url: imgUrl,
        pic_description: postContent,
        user_id: +req.user.user_id,
      },
      omit: {
        pic_url: true,
        is_deleted: true,
        created_at: true,
        updated_at: true,
      },
    });

    return {
      ...newPicture,
      imgUrl,
    };
  },

  // check username: FE check available userName trước khi chạy upload
  checkAvailableUserName: async (req) => {
    console.log(req.body);
    const isUserName = await prisma.users.findFirst({
      where: {
        user_name: req.body.userName,
      },
    });
    // console.log(isUserName, !isUserName);

    return isUserName ? "Not Available" : "Available";
  },

  // update thông tin user
  updateUserInfo: async (req) => {
    const file = req.file;
    if (!file) throw new BadRequestError("No file in request");

    const arrPath = file.path?.split(path.sep);
    const imgUrl = arrPath?.join("/");
    // const imgUrl = file.path.replaceAll(path.sep, "/"); // ES2021
    const { userName, firstName, lastName, userBio, userWeb, userAge } =
      req.body;

    // check lỗi trùng user_name
    const isUserName = await prisma.users.findFirst({
      where: {
        user_name: userName,
      },
    });
    if (isUserName) throw new BadRequestError(USER_NAME_NOT_AVAILABLE);

    const fullName =
      !firstName && !lastName ? null : firstName + " " + lastName;

    const newUpdateUser = await prisma.users.update({
      where: {
        user_id: +req.user.user_id,
      },
      data: {
        avatar: imgUrl,
        user_name: userName || null,
        first_name: cleanString(firstName) || null,
        last_name: cleanString(lastName) || null,
        full_name: cleanString(fullName),
        user_bio: userBio.trim() || null,
        user_web: userWeb || null,
        age: userAge * 1 || null,
      },
      omit: {
        is_deleted: true,
        created_at: true,
        updated_at: true,
      },
    });

    return newUpdateUser;
  },
};
