import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

// if (process.env.NODE_ENV === "development") {
//   prisma = new PrismaClient();
// } else {
//   if (!global.prisma) {
//     global.prisma: = new PrismaClient();
//   }

//   prisma = global.prisma;
// }

export default prisma;
