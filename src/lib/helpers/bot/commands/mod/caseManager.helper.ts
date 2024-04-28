import { Prisma, PrismaCoreModule } from "@lib/database/prisma";
import { Case } from "@shared/interfaces/utils/cases.interface";

export class CaseManagerHelper {
    private prisma: PrismaCoreModule;

    constructor() {
        this.prisma = Prisma;
    }

    public async create(data: Case): Promise<number> {
        const caseId = await this.getNextCaseId(data.guildId);
        const moderation = await this.prisma.moderation.create({
            data: {
                guildId: data.guildId,
                caseId,
                moderatorId: data.modId,
                userId: data.userId,
                reason: data.reason,
                type: data.type,
            },
        });
        return moderation.caseId;
    }

    private async getNextCaseId(guildId: string): Promise<number> {
        const lastCase = await this.prisma.moderation.findFirst({
            where: { guildId },
            orderBy: { caseId: 'desc' },
        });

        const nextCaseId = lastCase ? lastCase.caseId + 1 : 1;
        return nextCaseId;
    }
}
