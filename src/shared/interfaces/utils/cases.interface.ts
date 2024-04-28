import { Cases } from "@shared/enum/misc/cases.enum";

interface CaseData {
    caseId?: number;
    guildId: string;
    modId: string;
    userId: string;
    reason: string;
    type: Cases;
}

export type Case = CaseData;
