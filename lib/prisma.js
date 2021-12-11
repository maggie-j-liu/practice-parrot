import { PrismaClient } from "@prisma/client";

let prismaGlobal;

const prisma = prismaGlobal || new PrismaClient();

if (process.env.NODE_ENV !== "production") prismaGlobal = prisma;

export default prisma;
