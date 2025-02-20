import { Subcommand, SubcommandOptions } from '@sapphire/plugin-subcommands';
import { BadgesCommandRegistry } from '../../shared/bot/commands/build/badges';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Emojis } from '../../shared/enum/Emojis';
import { ApplyOptions } from '@sapphire/decorators';
import { BadgesOwnerCommand } from '../../shared/bot/commands/options/SubCommands/badges';
import { Colors, EmbedBuilder } from 'discord.js';

@ApplyOptions<SubcommandOptions>(BadgesOwnerCommand.Options)
export class BadgesCommand extends Subcommand {
	public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
		super(context, { ...options });
	}

	public override registerApplicationCommands(registry: Subcommand.Registry) {
		BadgesCommandRegistry.registerCommands(registry);
	}

	public async ChatInputCreate(interaction: Subcommand.ChatInputCommandInteraction) {
		await interaction.deferReply();
		const badge = interaction.options.getAttachment('badge', true);
		const name = interaction.options.getString('name', true);
		const url = await this.container.cloudinary.uploadImage(badge.url, interaction.guildId!);

		try {
			await this.container.prisma.badges.create({
				data: {
					badgeUrl: url,
					name: name
				}
			});

			return interaction.editReply({
				content: await resolveKey(interaction, `commands/replies/admin:owner_badge_success`, { emoji: Emojis.SUCCESS })
			});
		} catch (error) {
			console.error(error);
			return interaction.editReply({ content: await resolveKey(interaction, `commands/replies/error:error`, { emoji: Emojis.ERROR }) });
		}
	}

	public async ChatInputList(interaction: Subcommand.ChatInputCommandInteraction) {
		await interaction.deferReply();
		const badges = await this.container.prisma.badges.findMany();

		if (!badges.length) {
			return interaction.editReply({
				content: await resolveKey(interaction, `commands/replies/admin:owner_badge_no_badges`, { emoji: Emojis.ERROR })
			});
		}

		return interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle('Badges')
					.setDescription(badges.map((badge) => `**${badge.id}**.  ${badge.name} - [Click Here](${badge.badgeUrl})`).join('\n'))
					.setColor(Colors.White)
			]
		});
	}

	public async ChatInputAssign(interaction: Subcommand.ChatInputCommandInteraction) {
		await interaction.deferReply();
		const badge = interaction.options.getNumber('badge', true);
		const user = interaction.options.getString('user', true);

		try {
			await this.container.prisma.user_badges.create({
				data: {
					badgeId: badge,
					userId: user
				}
			});

			return interaction.editReply({
				content: await resolveKey(interaction, `commands/replies/admin:owner_badge_assign_success`, { emoji: Emojis.SUCCESS })
			});
		} catch (error) {
			console.error(error);
			return interaction.editReply({ content: await resolveKey(interaction, `commands/replies/error:error`, { emoji: Emojis.ERROR }) });
		}
	}

	public async ChatInputRemove(interaction: Subcommand.ChatInputCommandInteraction) {
		await interaction.deferReply();
		const badge = interaction.options.getString('badge', true);
		const user = interaction.options.getString('user', true);

		try {
			await this.container.prisma.user_badges.deleteMany({
				where: {
					userId: user,
					badgeId: parseInt(badge)
				}
			});

			return interaction.editReply({
				content: await resolveKey(interaction, `commands/replies/admin:owner_badge_remove_success`, { emoji: Emojis.SUCCESS })
			});
		} catch (error) {
			console.error(error);
			return interaction.editReply({ content: await resolveKey(interaction, `commands/replies/error:error`, { emoji: Emojis.ERROR }) });
		}
	}
}
