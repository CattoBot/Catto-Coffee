import { ApplyOptions } from '@sapphire/decorators';
import { CacheType, InteractionResponse } from 'discord.js';

import { Subcommand, SubcommandOptions } from '@sapphire/plugin-subcommands';
import { OwnerOnlyCommands } from '@shared/commands/build/subcommands/owner';
import { AddServerBlacklistCommand } from '@lib/helpers/bot/commands/owners/add-bl-server';
import { OwnerOnlyCommandsOptions } from '@shared/commands/options/SubCommands/owner-only.command.options';
import { AddUserBlacklistCommand } from '@lib/helpers/bot/commands/owners/add-bl-user';
import { RemoveUserBlacklistCommand } from '@lib/helpers/bot/commands/owners/remove-bl-user';
import { RemoveServerBlacklistCommand } from '@lib/helpers/bot/commands/owners/remove-bl-server';

@ApplyOptions<SubcommandOptions>(OwnerOnlyCommandsOptions.Options)
export class BlacklistCommands extends Subcommand {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
        });
    }

    registerApplicationCommands(registry: Subcommand.Registry) {
        OwnerOnlyCommands.registerCommands(registry);
    }

    public async ChatInputServer(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return await AddServerBlacklistCommand.run(interaction);
    }
    public async ChatInputUser(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return await AddUserBlacklistCommand.run(interaction);
    }
    public async ChatInputRemoveUser(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return await RemoveUserBlacklistCommand.run(interaction)
    }
    public async ChatInputRemoveServer(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return await RemoveServerBlacklistCommand.run(interaction)
    }
}
