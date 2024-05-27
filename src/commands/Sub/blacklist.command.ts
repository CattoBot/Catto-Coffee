import { ApplyOptions } from '@sapphire/decorators';
import { CacheType } from 'discord.js';
import { Subcommand, SubcommandOptions } from '@sapphire/plugin-subcommands';
import { AddServerBlacklistCommand } from '../../lib/commands/owners/add-bl-server';
import { AddUserBlacklistCommand } from '../../lib/commands/owners/add-bl-user';
import { RemoveServerBlacklistCommand } from '../../lib/commands/owners/remove-bl-server';
import { RemoveUserBlacklistCommand } from '../../lib/commands/owners/remove-bl-user';
import { BlacklistCommandRegistry } from '../../shared/bot/commands/build/owner';
import { OwnerOnlyCommandsOptions } from '../../shared/bot/commands/options/SubCommands/owner-only.command.options';


@ApplyOptions<SubcommandOptions>(OwnerOnlyCommandsOptions.Options)
export class BlacklistCommands extends Subcommand {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
        });
    }

    override registerApplicationCommands(registry: Subcommand.Registry) {
        BlacklistCommandRegistry.registerCommands(registry);
    }

    public async ChatInputServer(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<void> {
        await AddServerBlacklistCommand.run(interaction);
    }
    public async ChatInputUser(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<void> {
        await AddUserBlacklistCommand.run(interaction);
    }
    public async ChatInputRemoveUser(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<void> {
        await RemoveUserBlacklistCommand.run(interaction)
    }
    public async ChatInputRemoveServer(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<void> {
        await RemoveServerBlacklistCommand.run(interaction)
    }
}
