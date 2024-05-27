import { Precondition } from "@sapphire/framework";
import { ChatInputCommandInteraction, Message } from "discord.js";
import { container } from "@sapphire/pieces";
import { getPrefix } from "../lib/utils";
import { resolveKey } from "@sapphire/plugin-i18next";

export class EnabledCommandPrecondition extends Precondition {
    constructor(context: Precondition.LoaderContext, options: Precondition.Options) {
        super(context, {
            ...options,
        });
    }

    public override async chatInputRun(interaction: ChatInputCommandInteraction) {
        const guildId = interaction.guildId;
        if (!guildId) return this.ok();
        const commandName = this.getCommandName(interaction);

        const disabled = await container.prisma.disabled_commands.findUnique({
            where: {
                guildId_command: {
                    guildId: guildId,
                    command: commandName,
                },
            },
        });

        const res = await resolveKey(interaction, 'preconditions/preconditions:command_disabled', { command: commandName });
        return disabled ? this.error({ message: res }) : this.ok();
    }

    public override async messageRun(message: Message) {
        const guildId = message.guild?.id;
        if (!guildId) return this.ok();

        const prefix = await getPrefix(guildId);
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
        const commandName = args.shift()!;
        const subCommandName = args.length > 0 ? args.join(' ') : null;

        const fullCommandName = subCommandName ? `${commandName} ${subCommandName}` : commandName;

        const res = await resolveKey(message, 'preconditions/preconditions:command_disabled', { command: fullCommandName });

        const disabled = await container.prisma.disabled_commands.findUnique({
            where: {
                guildId_command: {
                    guildId: guildId,
                    command: fullCommandName,
                },
            },
        });

        return disabled ? this.error({ message: res }) : this.ok();
    }

    private getCommandName(interaction: ChatInputCommandInteraction): string {
        const subCommandGroup = interaction.options.getSubcommandGroup(false);
        const subCommand = interaction.options.getSubcommand(false);
        const commandName = [interaction.commandName, subCommandGroup, subCommand].filter(Boolean).join(' ');
        return commandName;
    }
}
