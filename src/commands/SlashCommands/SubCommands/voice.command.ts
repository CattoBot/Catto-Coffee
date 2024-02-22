import { Subcommand } from '@sapphire/plugin-subcommands';
import { ApplyOptions, RequiresClientPermissions, RequiresUserPermissions } from '@sapphire/decorators';
import { CommandOptions } from '@sapphire/framework';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Guild } from 'discord.js';
import { VoiceSubCommands } from '@shared/commands/options/SubCommands/voice-command.options';
import { VoiceSetupHelper } from '@lib/helpers/voice/setup';
import { Emojis } from '@shared/enum/misc/emojis.enum';
import { VoiceCommandsRegistration } from '@shared/commands/build/subcommands/voice';
import { CommandPermissions } from '@shared/enum/commands/permissions.enum';
import { Cooldown } from '@lib/decorators/cooldown';

@ApplyOptions<CommandOptions>(VoiceSubCommands.Options)
export class VoiceCommands extends Subcommand {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
        });
    }

    registerApplicationCommands(registry: Subcommand.Registry) {
        VoiceCommandsRegistration.registerCommands(registry);
    }

    @RequiresClientPermissions(CommandPermissions.ManageGuild)
    @RequiresUserPermissions(CommandPermissions.ManageGuild)
    @Cooldown({ seconds: 60 })
    public async chatInputSetup(interaction: Subcommand.ChatInputCommandInteraction): Promise<void> {
        const guild: Guild = interaction.guild;
        const category = await VoiceSetupHelper.createCategory(guild);
        const channel = await VoiceSetupHelper.createVoiceChannel(guild, category?.id);
        await VoiceSetupHelper.createDatabaseEntry(guild, channel, category);
        await interaction.reply(await resolveKey(interaction, 'commands/replies/voice:voice_setup_success', { emoji: Emojis.SUCCESS }))
    }
}
