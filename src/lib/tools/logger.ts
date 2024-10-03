import { ContextMenuCommandSuccessPayload, Command, container, ChatInputCommandSuccessPayload, MessageCommandSuccessPayload } from "@sapphire/framework";
import { type APIUser, type Guild, type User } from 'discord.js';
import { cyan } from 'colorette';

export default {
    logSuccessCommand(payload: ContextMenuCommandSuccessPayload | ChatInputCommandSuccessPayload | MessageCommandSuccessPayload): void {
        let successLoggerData: ReturnType<typeof this.getSuccessLoggerData>;
        if ('interaction' in payload) {
            successLoggerData = this.getSuccessLoggerData(payload.interaction.guild, payload.interaction.user, payload.command);
        } else {
            successLoggerData = this.getSuccessLoggerData(payload.message.guild, payload.message.author, payload.command);
        }
        container.logger.debug(`${successLoggerData.shard} - ${successLoggerData.commandName} ${successLoggerData.author} ${successLoggerData.sentAt}`);
    },

    getSuccessLoggerData(guild: Guild | null, user: User, command: Command) {
        const shard = this.shardsInfo(guild?.shardId ?? 0);
        const commandName = this.commandsInfo(command);
        const author = this.authorInfo(user);
        const sentAt = this.guildsInfo(guild);
        return { shard, commandName, author, sentAt };
    },

    authorInfo: (author: User | APIUser) => `${author.username}[${cyan(author.id)}]`,
    shardsInfo: (id: number) => `[${cyan(id.toString())}]`,
    commandsInfo: (command: Command) => cyan(command.name),
    guildsInfo: (guild: Guild | null) => (guild === null) ? `[${cyan('DM')}]` : `${guild.name}[${cyan(guild.id)}]`,

}