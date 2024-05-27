import { Precondition } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Emojis } from "../shared/enum/Emojis";
import { CommandInteraction, GuildMember, Message } from "discord.js";

export class ChannelOwnerPrecondition extends Precondition {
    public override async chatInputRun(interaction: CommandInteraction) {
        return this.processInteraction(interaction);
    }

    public override async contextMenuRun(interaction: CommandInteraction) {
        return this.processInteraction(interaction);
    }

    public override async messageRun(message: Message) {
        return this.processMessage(message);
    }

    private async processInteraction(interaction: CommandInteraction) {
        const member = interaction.member as GuildMember;
        return this.checkChannelOwnership(member, interaction);
    }

    private async processMessage(message: Message) {
        const member = message.member as GuildMember;
        return this.checkChannelOwnership(member, message);
    }

    private async checkChannelOwnership(member: GuildMember, context: CommandInteraction | Message) {
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            return this.error({ message: await resolveKey(context, 'commands/replies/commandDenied:not_in_voice_channel', { emoji: Emojis.ERROR }) });
        }

        const trustedUsers = await this.getTrustedUsers(member.guild.id, voiceChannel.id);
        const isTrustedUser = trustedUsers.some(user => user.userId === member.id);
        const getChannel = await this.findChannel(member.guild.id, voiceChannel.id);

        if (!getChannel) {
            return this.error({ message: await resolveKey(context, 'commands/replies/commandDenied:voice_not_found_in_db', { emoji: Emojis.ERROR }) });
        }

        if (member.id !== getChannel.channelOwnerId && !isTrustedUser) {
            return this.error({ message: await resolveKey(context, 'commands/replies/commandDenied:not_voice_channel_owner', { emoji: Emojis.ERROR }) });
        }

        return this.ok();
    }

    private async getTrustedUsers(guildId: string, channelId: string) {
        const users = await this.container.prisma.trusted_voice_users.findMany({
            where: {
                guildId: guildId,
                channelId: channelId
            }
        });
        return users;
    }

    private async findChannel(guildId: string, channelId: string) {
        const channel = await this.container.prisma.voice_temp_channels.findUnique({
            where: {
                guildId_channelId: {
                    guildId: guildId,
                    channelId: channelId
                }
            },
        });

        return channel;
    }
}
