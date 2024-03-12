import { Precondition } from "@sapphire/framework";

import { CommandInteraction } from "discord.js";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { Prisma } from "@lib/database/prisma";
import { resolveKey } from "@sapphire/plugin-i18next";

export class VoiceModulePrecondition extends Precondition {
    private prisma: Prisma = new Prisma();
    public async chatInputRun(interaction: CommandInteraction) {
        const tempVoice = await this.prisma.tempChannelSettings.findMany({
            where: {
                guildId: interaction.guild?.id
            },
        });
        if (tempVoice.length > 0) {
            return this.ok();
        } else {
            return this.error({
                message: (await resolveKey(interaction, 'preconditions/preconditions:voice_sysem_enabled', { emoji: Emojis.ERROR })),
            });
        }
    }
}