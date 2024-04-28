import { ApplyOptions } from '@sapphire/decorators';
import { CacheType, InteractionResponse } from 'discord.js';
import { Subcommand, SubcommandOptions } from '@sapphire/plugin-subcommands';
import { LevelingCommandsRegistration } from '@shared/commands/build/subcommands/leveling';
import { LevelSubCommands } from '@shared/commands/options/SubCommands/level-command.options';

@ApplyOptions<SubcommandOptions>(LevelSubCommands.Options)
export class LevelingCommands extends Subcommand {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
        });
    }

    registerApplicationCommands(registry: Subcommand.Registry) {
        LevelingCommandsRegistration.registerCommands(registry);
    }

    public async ChatInputRank(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return await interaction.reply(`Rank Command!`);
    }

    public async ChatInputLeaderboard(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return await interaction.reply(`Leaderboard Command!`);
    }
    public async ChatInputRewards(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return await interaction.reply(`Rewards Command!`);
    }
}
