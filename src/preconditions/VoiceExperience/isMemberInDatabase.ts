import { Precondition } from "@sapphire/framework";
import { Prisma } from "../../client/PrismaClient";
import { GuildMember } from "discord.js";

export class VoiceMemberDatabase extends Precondition {

    private async getMemberData(member: GuildMember) {
        
        const memberData = await Prisma.usersVoiceExperienceData.findUnique({
            where: {
                UserID_GuildID: {
                    UserID: member.id,
                    GuildID: member.guild.id
                }
            }
        });
        return memberData;
    }
    public async run(member: GuildMember) {
        const MemberExists = this.getMemberData(member)
        
        if(await MemberExists){
            return this.ok();
        } else {
            return this.error({ message: "No se han encontrado datos registrados para este usuario." });
        }
    }
}