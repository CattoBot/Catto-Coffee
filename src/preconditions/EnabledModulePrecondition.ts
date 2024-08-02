import { Precondition } from "@sapphire/framework";
import { ChatInputCommandInteraction, Message } from "discord.js";
import { container } from "@sapphire/pieces";
import { resolveKey } from "@sapphire/plugin-i18next";

export class EnabledModulePrecondition extends Precondition {
    constructor(context: Precondition.LoaderContext, options: Precondition.Options) {
        super(context, {
            ...options,
        });
    }

    public override async chatInputRun(interaction: ChatInputCommandInteraction) {
        const guildId = interaction.guildId;
        if (!guildId) return this.ok();
        const moduleName = this.getModuleName(interaction);

        const disabled = await container.prisma.disabled_modules.findUnique({
            where: {
                guildId_module: {
                    guildId: guildId,
                    module: moduleName,
                },
            },
        });

        const res = await resolveKey(interaction, 'preconditions/preconditions:module_disabled', { module: moduleName });

        return disabled ? this.error({ message: res }) : this.ok();
    }

    public override async messageRun(message: Message) {
        const guildId = message.guild?.id;
        if (!guildId) return this.ok();

        const prefix = await container.utils.guilds.getPrefix(guildId);
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
        const moduleName = args[0];

        const disabled = await container.prisma.disabled_modules.findUnique({
            where: {
                guildId_module: {
                    guildId: guildId,
                    module: moduleName,
                },
            },
        });

        const res = await resolveKey(message, 'preconditions/preconditions:module_disabled', { module: moduleName });
        return disabled ? this.error({ message: res }) : this.ok();
    }

    private getModuleName(interaction: ChatInputCommandInteraction): string {
        return interaction.commandName;
    }
}
