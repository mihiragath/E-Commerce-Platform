import { PrismaClient } from "../app/generated/prisma/client";

const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    errorFormat: "minimal",
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
