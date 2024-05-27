import { Precondition } from "@sapphire/framework";
import { ChatInputCommandInteraction, GuildMember, Message } from "discord.js";
import { container } from "@sapphire/pieces";
import { resolveKey } from "@sapphire/plugin-i18next";

export class EditableChannelPrecondition extends Precondition {
    public override async chatInputRun(interaction: ChatInputCommandInteraction) {
        const guildId = interaction.guildId;
        const member = interaction.member as GuildMember;

        if (!guildId || !member) return this.error({ message: await resolveKey(interaction, 'preconditions/error:error') });

        const isEditable = await this.shouldBeEdited(guildId, member.voice.channel?.id!);
        return isEditable ? this.ok() : this.error({ message: await resolveKey(interaction, 'preconditions/voice:channel_not_editable') });
    }

    public override async messageRun(message: Message) {
        const guildId = message.guild?.id;
        const channelId = message.member?.voice.channel?.id;

        if (!guildId || !channelId) return this.error({ message: await resolveKey(message, 'preconditions/error:error') });

        const isEditable = await this.shouldBeEdited(guildId, channelId);
        return isEditable ? this.ok() : this.error({ message: await resolveKey(message, 'preconditions/voice:channel_not_editable') });
    }

    private async shouldBeEdited(guildId: string, channelId: string) {
        const voiceChannel = await container.prisma.voice_temp_channels.findUnique({
            where: { guildId_channelId: { guildId, channelId } },
        });

        if (!voiceChannel) return false;

        const iVoiceCategory = await container.prisma.editable_channels.findFirst({
            where: {
                guildId: guildId,
                categoryId: voiceChannel.channelCategoryId,
            }
        });

        return iVoiceCategory?.editable ?? false;
    }
}
