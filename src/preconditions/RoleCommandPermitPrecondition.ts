import { Precondition } from '@sapphire/framework';
import { ChatInputCommandInteraction, GuildMember, Message } from 'discord.js';
import { Emojis } from '../shared/enum/Emojis';
import { resolveKey } from '@sapphire/plugin-i18next';

export class RoleCommandPermitPrecondition extends Precondition {
	public override async chatInputRun(interaction: ChatInputCommandInteraction) {
		return this.runChatInput(interaction);
	}

	public override async messageRun(message: Message) {
		return this.runMessage(message);
	}

	public async getPermittedRoles(guildId: string, commandName: string) {
		const roles = await this.container.prisma.restricted_command_roles.findMany({
			where: {
				guildId: guildId,
				commandName: commandName
			}
		});
		return roles;
	}

	private getMemberRoles(member: GuildMember) {
		return new Set(member.roles.cache.map((role) => role.id));
	}

	private async runChatInput(interaction: ChatInputCommandInteraction) {
		const guild = interaction.guild;
		const member = interaction.member as GuildMember;
		const commandName = this.getCommandName(interaction);

		if (!guild || !member || !commandName) {
			return this.error({ message: Emojis.ERROR });
		}

		const permittedRoles = await this.getPermittedRoles(guild.id, commandName);

		if (permittedRoles.length === 0) {
			return this.ok(); // Proceed to next precondition
		}

		const memberRoles = this.getMemberRoles(member);
		const missingRoles = permittedRoles.filter((role) => !memberRoles.has(role.roleId));

		if (missingRoles.length === 0) {
			return this.ok(); // Proceed to next precondition
		} else {
			const missingRoleNames = await Promise.all(
				missingRoles.map(async (role) => {
					const fetchedRole = await guild.roles.fetch(role.roleId);
					return fetchedRole?.name || role.roleId;
				})
			);
			const messageContent = await resolveKey(interaction, `preconditions/preconditions:MISSING_ROLE`, {
				roles: `\`${missingRoleNames.join(', ')}\``,
				emoji: Emojis.ERROR
			});
			return this.error({ message: messageContent });
		}
	}

	private async runMessage(message: Message) {
		const guild = message.guild;
		const member = message.member as GuildMember;
		const guildId = guild?.id;

		if (!guildId || !member) {
			return this.error({ message: Emojis.ERROR });
		}

		const prefix = await this.container.utils.guilds.getPrefix(guildId);
		const botMention = `<@${message.client.user!.id}>`;
		const botMentionNickname = `<@!${message.client.user!.id}>`;

		let content = message.content.trim();

		if (content.startsWith(prefix)) {
			content = content.slice(prefix.length).trim();
		} else if (content.startsWith(botMention)) {
			content = content.slice(botMention.length).trim();
		} else if (content.startsWith(botMentionNickname)) {
			content = content.slice(botMentionNickname.length).trim();
		} else {
			return this.ok();
		}

		const args = content.split(' ');
		const mainCommandName = args.shift()!;
		const subCommandName = args.join(' ');

		console.log(`Command name: ${mainCommandName}, Subcommand: ${subCommandName}`);

		// Check roles for the main command
		let permittedRoles = await this.getPermittedRoles(guildId, mainCommandName);

		// If no roles are permitted for the main command, check for the subcommand
		if (permittedRoles.length === 0 && subCommandName) {
			permittedRoles = await this.getPermittedRoles(guildId, `${mainCommandName} ${subCommandName}`);
		}

		if (permittedRoles.length === 0) {
			return this.ok(); // Proceed to next precondition
		}

		const memberRoles = this.getMemberRoles(member);
		const missingRoles = permittedRoles.filter((role) => !memberRoles.has(role.roleId));

		if (missingRoles.length === 0) {
			return this.ok(); // Proceed to next precondition
		} else {
			const missingRoleNames = await Promise.all(
				missingRoles.map(async (role) => {
					const fetchedRole = await guild.roles.fetch(role.roleId);
					return fetchedRole?.name || role.roleId;
				})
			);
			const messageContent = await resolveKey(message, `preconditions/preconditions:MISSING_ROLE`, {
				roles: `\`${missingRoleNames.join(', ')}\``,
				emoji: Emojis.ERROR
			});
			return this.error({ message: messageContent });
		}
	}

	private getCommandName(interaction: ChatInputCommandInteraction): string {
		const subCommandGroup = interaction.options.getSubcommandGroup(false);
		const subCommand = interaction.options.getSubcommand(false);
		const commandName = [interaction.commandName, subCommandGroup, subCommand].filter(Boolean).join(' ');
		return commandName;
	}
}
