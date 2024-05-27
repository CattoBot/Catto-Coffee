import { Args, Command } from "@sapphire/framework";
import { Message, User } from "discord.js";
import { AvatarExtension, UserInfo } from '../../shared/interfaces/UserInfo';
import { DrawCanvas } from "../../lib/classes/Canvas";
import { reply } from "@sapphire/plugin-editable-commands";
import { applyLocalizedBuilder } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";

export class ProfileCommand extends Command {
    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Check your global profile.',
            aliases: ['p']
        });
    }

    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(builder =>
            applyLocalizedBuilder(builder, 'commands/names/level:profile', 'commands/descriptions/level:profile')
                .addUserOption(option =>
                    applyLocalizedBuilder(option, 'commands/names/level:user', 'commands/descriptions/level:user_description').setRequired(false)
                )
        )
    }

    override async chatInputRun(command: Command.ChatInputCommandInteraction) {
        await command.deferReply();
        const user = command.options.getUser('user') ?? command.user;

        if (!user) {
            return await command.reply('User not found.');
        }
        const userInfo = await this.fetchUserInfo(user, command);

        if (!userInfo) {
            return await command.reply('User data not found.');
        }

        const buffer = await DrawCanvas.generateProfileCard(userInfo);
        const attachment = {
            attachment: buffer,
            name: 'profile.png'
        };

        return await command.editReply({ files: [attachment] });
    }

    override async messageRun(message: Message, args: Args) {
        await message.channel.sendTyping();
        const user = await args.pick('user').catch(() => message.author);
        if (!user) {
            return message.reply('User not found.');
        }
        const userInfo = await this.fetchUserInfo(user, message);

        if (!userInfo) {
            return message.reply('User data not found.');
        }

        const buffer = await DrawCanvas.generateProfileCard(userInfo);
        const attachment = {
            attachment: buffer,
            name: 'profile.png'
        };

        return await reply(message, { files: [attachment] });
    }

    private async fetchUserInfo(user: User, context: Message | Subcommand.ChatInputCommandInteraction): Promise<UserInfo | null> {
        const data = await this.container.prisma.users.findUnique({
            where: { userId: user.id }
        });

        if (!data) {
            if (context instanceof Message) {
                await context.reply('User data not found.');
            } else {
                await context.editReply('User data not found.');
            }
            return null;
        }

        const rank = await this.getRank(user.id);

        const userInfo: UserInfo = {
            userId: user.id,
            username: user.username,
            displayAvatarURL: (options: { extension: AvatarExtension; size: 512 }) => user.displayAvatarURL(options),
            level: data.globalLevel!,
            experience: data.globalExperience!,
            displayName: user.displayName,
            rank: rank!,
            totalhours: data.totalTimeInVoiceChannel!,
            totalMessages: data.totalRegisteredMessages!,
            aboutMe: data.aboutme!
        };

        return userInfo;
    }

    private async getRank(userId: string) {
        const allUsers = await this.container.prisma.users.findMany({
            orderBy: [
                {
                    globalLevel: 'desc'
                },
                {
                    totalGlobalExperience: 'desc'
                },
                {
                    totalTimeInVoiceChannel: 'desc'
                },
                {
                    totalRegisteredMessages: 'desc'
                }
            ]
        });

        const userIndex = allUsers.findIndex(user => user.userId === userId);
        return userIndex !== -1 ? userIndex + 1 : undefined;
    }
}
