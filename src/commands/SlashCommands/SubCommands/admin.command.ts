import { AdminSubCommandOptions } from '@shared/commands/options/SubCommands/admin-command.options';
import { AdminSubCommandsRegistration } from '@shared/commands/build/subcommands/admin';
import { ApplyOptions } from '@sapphire/decorators';
import { CacheType, InteractionResponse } from 'discord.js';

import { Subcommand, SubcommandOptions } from '@sapphire/plugin-subcommands';
import { WebhookLogsCommand, VoiceSetupCommand, AddUserToGuildBlacklistCommand, RemoveUserFromGuildBlacklistCommand } from '@AdminCommands';

@ApplyOptions<SubcommandOptions>(AdminSubCommandOptions.Options)
export class AdminCommands extends Subcommand {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
        });
    }

    registerApplicationCommands(registry: Subcommand.Registry) {
        AdminSubCommandsRegistration.registerCommands(registry);
    }


    public async ChatInputLogs(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<void> {
        return await WebhookLogsCommand.run(interaction);
    }
    public async ChatInputVoices(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return await VoiceSetupCommand.run(interaction.guild, interaction);
    }
    public async ChatInputAddUserToGuildBlacklist(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return await AddUserToGuildBlacklistCommand.run(interaction);
    }
    public async ChatRemoveUserFromGuildBlacklist(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return await RemoveUserFromGuildBlacklistCommand.run(interaction);
    }
}
