import { PrismaClient } from "@prisma/client";

export class Prisma {
    private static readonly instance: PrismaClient = new PrismaClient();
    private constructor() { }
    public static getPrisma(): PrismaClient {
        return Prisma.instance;
    }
}
