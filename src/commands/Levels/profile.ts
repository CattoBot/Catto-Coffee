import { Args, Command } from "@sapphire/framework";
import { Message, User } from "discord.js";
import { AvatarExtension, UserInfo } from '../../shared/interfaces/UserInfo';
import { reply } from "@sapphire/plugin-editable-commands";
import { applyLocalizedBuilder } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { ProfileCardBuilder } from "../../lib/classes/ProfileCard";
import { Emojis } from "../../shared/enum/Emojis";

export class ProfileCommand extends Command {
    constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            description: 'Displays your global profile.',
            aliases: ['p']
        });
    }

    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(builder =>
            applyLocalizedBuilder(builder, 'commands/names/level:profile', 'commands/descriptions/level:profile')
                .addUserOption(option =>
                    applyLocalizedBuilder(option, 'commands/names/level:user', 'commands/descriptions/level:user_description').setRequired(false)
                )
        );
    }

    override async chatInputRun(command: Command.ChatInputCommandInteraction) {
        await command.deferReply();
        const user = command.options.getUser('user') ?? command.user;

        if (!user) {
            return await command.reply(`I couldn't find the user you're looking for. ${Emojis.ERROR}`);
        }

        const userInfo = await this.fetchUserInfo(user, command);

        if (!userInfo) {
            return await command.reply(`Seems like I couldn't find the user data. ${Emojis.ERROR}`);
        }

        const buffer = new ProfileCardBuilder(userInfo).build();
        const attachment = {
            attachment: await buffer,
            name: 'profile.png'
        };

        return await command.editReply({ files: [attachment] });
    }

    override async messageRun(message: Message, args: Args) {
        if (message.channel.isSendable())
            await message.channel.sendTyping();
        const user = await args.pick('user').catch(() => message.author);

        if (!user) {
            return message.reply(`I couldn't find the user you're looking for. ${Emojis.ERROR}`);
        }

        const userInfo = await this.fetchUserInfo(user, message);

        if (!userInfo) {
            return message.reply(`Seems like I couldn't find the user data. ${Emojis.ERROR}`);
        }

        const builder = new ProfileCardBuilder(userInfo);
        const attachment = await builder.build();

        return await reply(message, { files: [attachment] });
    }

    private async fetchUserInfo(user: User, context: Message | Subcommand.ChatInputCommandInteraction): Promise<UserInfo | null> {
        const data = await this.container.prisma.users.findUnique({
            where: { userId: user.id }
        });

        if (!data) {
            if (context instanceof Message) {
                await context.reply(`Seems like I couldn't find the user data. ${Emojis.ERROR}`);
            } else {
                await context.editReply(`Seems like I couldn't find the user data. ${Emojis.ERROR}`);
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

    private async getRank(userId: string): Promise<number | undefined> {
        const leaderboardKey = 'generalLeaderboard';
        const leaderboardExists = await this.container.redis.exists(leaderboardKey);
        if (!leaderboardExists) {
            const allUsers = await this.container.prisma.users.findMany({
                select: { userId: true, totalGlobalExperience: true }
            });

            const pipeline = this.container.redis.pipeline();
            for (const user of allUsers) {
                pipeline.zadd(leaderboardKey, user.totalGlobalExperience, user.userId);
            }
            await pipeline.exec();
        }

        const rank = await this.container.redis.zrevrank(leaderboardKey, userId);
        return rank !== null ? rank + 1 : undefined;
    }
}
