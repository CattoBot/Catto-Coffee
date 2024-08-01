import { container } from "@sapphire/pieces";
import { GuildMember } from "discord.js";

export class dbtempvcService {
    public static async updateLock(member: GuildMember, status:boolean) {
        await container.prisma.i_users_temp_voice.upsert({
            where: {
                userId: member.id
            }, update: {
                isLocked: true
            }, create: {
                userId: member.id,
                isLocked: status
            }
        })
    }
}