import { Prisma, PrismaCoreModule } from "@lib/database/prisma";
import { resolveKey } from "@sapphire/plugin-i18next";
import { BaseInteraction, TextChannel } from "discord.js";

export class ContextMenuVoiceCommandsHelper {
    public prisma: PrismaCoreModule
    constructor() {
        this.prisma = Prisma;
    }

    public async run(interaction: BaseInteraction, channelId: string, message: string) {
        return this.send(interaction, channelId, message);
    }

    public async find(channelId: string, guildId: string) {
        const channel = await this.prisma.iVoices.findUnique({
            where: {
                guildId_channelId: {
                    guildId: guildId,
                    channelId: channelId
                }
            }, include: {
                iTempVoiceUtils: true
            }
        })

        return channel.iTempVoiceUtils.find(util => util.guildId === guildId);
    }

    public async send(interaction: BaseInteraction, channelId: string, message: string) {
        let channel: TextChannel
        const findChannel = await this.find(channelId, interaction.guild.id);
        if (!findChannel) {
            channel = interaction.guild.systemChannel;
        }
        else {
            channel = interaction.guild.channels.resolve(findChannel.defaultCommandsChannel) as TextChannel;
        }

        await channel.send(await resolveKey(interaction, message))
    }
}
