import { Precondition } from "@sapphire/framework";
import { Prisma } from "../../client/PrismaClient";
import type { Guild } from "discord.js";
import config from "../../config";

export class CheckVoiceEnabledListener extends Precondition {

    private async getGuildData(Guild: Guild) {
        
        const GuildData = await Prisma.guildsData.findUnique({
            where: {
              GuildID: Guild.id
            }
        });
        return GuildData?.VoiceExpEnabled
    }
    public async run(Guild: Guild) {
        const DataEnabled = this.getGuildData(Guild)
        
        if(await DataEnabled === true){
            return this.ok();
        } else {
            return this.error({ message: `${config.emojis.error} Parece que la experiencia por voz en este servidor está desactivada.` });
        }
    }
}