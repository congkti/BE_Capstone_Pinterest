import { ACCESS_TOKEN_SECRET } from "../common/constant/global.constant.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../common/helpers/error.helper.js";
import prisma from "../common/prisma/init.prisma.js";
import { removeVietnameseTones } from "../common/utils/vietnamese-tones.util.js";

export const picturesService = {
  // home page
  listPictures: async (req) => {
    console.log(req.user);
    const listPictures = await prisma.pictures.findMany({
      where: {
        user_id: req.user.userId,
        is_deleted: false,
      },
    });
    if (listPictures.length === 0)
      throw new NotFoundError("No pictures available");

    return listPictures;
  },
  searchByName: async (req) => {
    const keyword = removeVietnameseTones(req.query.name)
      ?.trim()
      ?.toLowerCase();
    if (!keyword) throw new BadRequestError("Keyword not found");
    const arrKeyword = keyword.split(" ");
    const pictures = await prisma.pictures.findMany({
      where: {
        is_deleted: false,
        AND: arrKeyword.map((word) => ({
          pic_name: {
            contains: word,
          },
        })),
      },
    });
    if (pictures.length === 0)
      throw new NotFoundError("No pictures found matching keyword");

    return pictures;
  },

  // Detail page
  // - Lấy thông tin hình ảnh: hình + tác giả + comment + tag theo id hình
  getInfoPicture: async (req) => {
    const param = req.params;
    const infoPicture = await prisma.pictures.findFirst({
      where: {
        pic_id: param.picId * 1,
        is_deleted: false,
      },
      select: {
        pic_id: true,
        pic_name: true,
        pic_url: true,
        pic_description: true,
        users: {
          select: {
            user_id: true,
            full_name: true,
            email: true,
            age: true,
            is_deleted: true,
          },
        },
        comments: {
          where: {
            is_deleted: false,
          },
          select: {
            comment_id: true,
            comment_content: true,
            comment_date: true,
          },
        },
        pictures_tags: {
          select: {
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

    if (!infoPicture)
      throw new NotFoundError(`Picture (id#${param.picId * 1}) does not exist`);

    const resData = {
      picId: infoPicture.pic_id,
      picName: infoPicture.pic_name,
      picUrl: infoPicture.pic_url,
      picDescription: infoPicture.pic_description,
      author: {
        userId: infoPicture.users.user_id,
        fullName: infoPicture.users.full_name,
        email: infoPicture.users.email,
        age: infoPicture.users.age,
        is_deleted: infoPicture.users.is_deleted,
      },
      comments: infoPicture.comments.map((item) => {
        return {
          id: item.comment_id,
          content: item.comment_content,
          date: item.comment_date,
        };
      }),
      tags: infoPicture.pictures_tags.map((tagItem) => {
        return {
          id: tagItem.tags.tag_id,
          name: tagItem.tags.tag_name,
        };
      }),
    };

    return resData;
  },

  // - Check hình ảnh đã lưu bởi user đang đăng nhập? --> có protect
  checkSavedStatus: async (req) => {
    const picId = +req.params.picId;
    const savedPicture = await prisma.save_picture.findFirst({
      where: {
        pic_id: picId,
        user_id: req.user.user_id,
      },
      select: {
        save_id: true,
        user_id: true,
        pic_id: true,
        save_date: true,
      },
    });
    const save_status = savedPicture ? "Saved" : "Not Saved";

    return { save_status, ...savedPicture };
  },

  // - Lưu thông tin comment
  postComment: async (req) => {
    const { picId, commentContent } = req.body;
    if (!commentContent)
      throw new BadRequestError("Comment content cannot be empty");

    const newComment = await prisma.comments.create({
      data: {
        user_id: req.user.user_id,
        pic_id: picId * 1,
        comment_content: commentContent,
      },
      omit: {
        created_at: true,
        updated_at: true,
      },
    });

    return newComment;
  },
};
