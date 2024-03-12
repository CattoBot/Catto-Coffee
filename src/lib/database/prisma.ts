import { PrismaClient } from "@prisma/client";

export class Prisma extends PrismaClient {
    constructor() {
        super(
            {
                datasources: {
                    db: {
                        url: process.env.DATABASE_URL,
                    },
                },
            }
        );
    }

    public async load(): Promise<void> {
        return await super.$connect();
    }
}