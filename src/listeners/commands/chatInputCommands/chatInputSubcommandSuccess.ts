import { ApplyOptions } from '@sapphire/decorators';
import { Listener, LogLevel } from '@sapphire/framework';
import type { Logger } from '@sapphire/plugin-logger';
import { ChatInputCommandSubcommandMappingMethod, ChatInputSubcommandSuccessPayload, SubcommandPluginEvents } from '@sapphire/plugin-subcommands';
import { ChatInputCommandInteraction, CacheType } from 'discord.js';

@ApplyOptions<Listener.Options>({ event: SubcommandPluginEvents.ChatInputSubcommandSuccess })
export class ChatInputSubCommandSuccessListener extends Listener<typeof SubcommandPluginEvents.ChatInputSubcommandSuccess> {
    public async run(interaction: ChatInputCommandInteraction<CacheType>, _subcommand: ChatInputCommandSubcommandMappingMethod, payload: ChatInputSubcommandSuccessPayload): Promise<unknown> {
        const { command } = payload;

        let subCommandGroupName: string | null = null;
        let subCommandName: string;

        try {
            subCommandGroupName = interaction.options.getSubcommandGroup(false);
            subCommandName = interaction.options.getSubcommand(true);
        } catch (error) {
            if ((error as { code: string }).code !== 'CommandInteractionOptionNoSubcommandGroup') {
                throw error;
            }
            subCommandName = interaction.options.getSubcommand(true);
        }

        const guildName = interaction.guild?.name ?? 'DM';
        const userTag = interaction.user.tag;
        const userId = interaction.user.id;

        if (subCommandGroupName) {
            this.container.logger.debug(
                `Shard ${interaction.guild?.shardId ?? 0} - Command: ${command.name} - Subcommand Group: ${subCommandGroupName} - Subcommand: ${subCommandName} - User: ${userTag} (${userId}) - Guild: ${guildName}`
            );
        } else {
            this.container.logger.debug(
                `Shard ${interaction.guild?.shardId ?? 0} - Command: ${command.name} - Subcommand: ${subCommandName} - User: ${userTag} (${userId}) - Guild: ${guildName}`
            );
        }

        return undefined;
    }

    public override onLoad() {
        this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
        return super.onLoad();
    }
}
