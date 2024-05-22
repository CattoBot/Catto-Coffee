import { Precondition } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { ChatInputCommandInteraction, GuildMember, Message } from "discord.js";
import { Emojis } from "../shared/enum/Emojis";

export class GuildVoiceOnlyPrecondition extends Precondition {
    public override async chatInputRun(interaction: ChatInputCommandInteraction) {
        const member = interaction.member as GuildMember;
        if (!member.voice.channel) return this.error({ message: await resolveKey(interaction, 'preconditions/voice:guildvoice_error', { emoji: Emojis.ERROR }) });
        return this.ok();
    }
    public override async messageRun(message: Message) {
        const member = message.member as GuildMember;
        if (!member.voice.channel) return this.error({ message: await resolveKey(message, 'preconditions/voice:guildvoice_error', { emoji: Emojis.ERROR }) });
        return this.ok();
    }
}