import { container } from '@sapphire/framework'
import  Client  from '../../../../index'
import { Prisma } from '../../../../../prisma/PrismaClient'

export async function getUsersInVoiceChannels() {
    try {
        Client.guilds.cache.forEach(async (guild) => {
            const GuildUsersIDs: string[] = []
            const VoiceChannelMembers = guild.voiceStates.cache.filter((vs) => vs.channel && !vs.member?.user.bot);
    
            VoiceChannelMembers.forEach((vs) => {
                if(vs.member?.id){
                    GuildUsersIDs.push(vs.member.id);
                }
            })
    
            if(GuildUsersIDs.length === 0){
                return
            }
    
            const GuildID = guild.id;
            const existingUsers = await Prisma.usersVoiceExperienceData.findMany({
                where: {
                    UserID: { in: GuildUsersIDs },
                    GuildID: GuildID
                },
                select: { UserID: true }
               
            });
            
            const existingUsersIDs: string[] = existingUsers.map((user) => user.UserID);
            const newUsersIds = GuildUsersIDs.filter((id) => !existingUsersIDs.includes(id));
    
            await Promise.all(
                newUsersIds.map(async (UserID) => {
                    await Prisma.usersVoiceExperienceData.createMany({
                        data: {
                            UserID,
                            GuildID
                        },
                        skipDuplicates: true
                    })
                })
            )
        })
    } catch (error) {
        container.logger.error(error)
    }

}