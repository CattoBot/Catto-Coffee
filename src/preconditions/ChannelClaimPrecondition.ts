import { Precondition } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Emojis } from '../shared/enum/Emojis';
import { CommandInteraction, GuildMember, Message } from 'discord.js';

export class ChannelClaimPrecondition extends Precondition {
	public override async chatInputRun(interaction: CommandInteraction) {
		return this.processInteraction(interaction);
	}

	public override async messageRun(message: Message) {
		return this.processMessage(message);
	}

	private async processInteraction(interaction: CommandInteraction) {
		const member = interaction.guild?.members.resolve(interaction.user.id) as GuildMember;
		const voiceChannel = member.voice?.channel;

		if (!voiceChannel) {
			return this.error({
				message: await resolveKey(interaction, `commands/replies/voice:user_not_in_voice_channel`, { emoji: Emojis.ERROR })
			});
		}

		const ownerId = await this.getVoiceChannelOwner(voiceChannel.id, interaction.guild!.id);

		if (voiceChannel.members.has(ownerId)) {
			return this.error({ message: await resolveKey(interaction, `commands/replies/voice:owner_in_voice_channel`, { emoji: Emojis.ERROR }) });
		}

		return this.ok();
	}

	private async processMessage(message: Message) {
		const member = message.guild?.members.resolve(message.author.id) as GuildMember;
		const voiceChannel = member.voice?.channel;

		if (!voiceChannel) {
			return this.error({ message: await resolveKey(message, `commands/replies/voice:user_not_in_voice_channel`, { emoji: Emojis.ERROR }) });
		}

		const ownerId = await this.getVoiceChannelOwner(voiceChannel.id, message.guild!.id);

		if (voiceChannel.members.has(ownerId)) {
			return this.error({ message: await resolveKey(message, `commands/replies/voice:owner_in_voice_channel`, { emoji: Emojis.ERROR }) });
		}

		return this.ok();
	}

	private async getVoiceChannelOwner(channelId: string, guildId: string) {
		const owner = await this.container.prisma.voice_temp_channels.findUnique({
			where: {
				guildId_channelId: {
					guildId: guildId,
					channelId: channelId
				}
			}
		});
		return owner?.channelOwnerId ?? '';
	}
}
