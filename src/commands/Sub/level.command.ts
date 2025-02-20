import { ApplyOptions } from '@sapphire/decorators';
import { CacheType } from 'discord.js';
import { Subcommand, SubcommandOptions } from '@sapphire/plugin-subcommands';
import { LeaderboardCommand } from '../../lib/commands/level/lb';
import { CattoRankCommand } from '../../lib/commands/level/rank';
import { RewardsCommand } from '../../lib/commands/level/rewards';
import { LevelingCommandsRegistry } from '../../shared/bot/commands/build/leveling';
import { LevelSubCommands } from '../../shared/bot/commands/options/SubCommands/levels';

@ApplyOptions<SubcommandOptions>(LevelSubCommands.Options)
export class LevelingCommands extends Subcommand {
	public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
		super(context, {
			...options
		});
	}

	override registerApplicationCommands(registry: Subcommand.Registry) {
		LevelingCommandsRegistry.registerCommands(registry);
	}

	public async ChatInputRank(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<void> {
		await CattoRankCommand.run(interaction);
	}

	public async ChatInputLeaderboard(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<void> {
		return LeaderboardCommand.run(interaction);
	}
	public async ChatInputRewards(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<void> {
		await RewardsCommand.run(interaction);
	}
}
