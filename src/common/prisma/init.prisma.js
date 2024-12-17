import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  omit: {
    users: {
      password: true,
    },
  },
});

export default prisma;
