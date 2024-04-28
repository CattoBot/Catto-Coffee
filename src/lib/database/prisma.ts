import { Config } from "@app/config";
import { PrismaClient } from "@prisma/client";

export class PrismaCoreModule extends PrismaClient {

    constructor() {
        super(
            {
                datasources: {
                    db: {
                        url: Config.Database.MySQL.URI,
                    },
                }
            }
        );
    }

    public async load(): Promise<void> {
        return await this.$connect();
    }
}

export const Prisma = new PrismaCoreModule();
