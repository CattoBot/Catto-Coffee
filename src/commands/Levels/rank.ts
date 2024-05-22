import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import { resolveKey } from '@sapphire/plugin-i18next';
import { type Message } from 'discord.js';
import { DrawCanvas } from '../../lib/classes/Canvas';
import { LevelingHelper } from '../../lib/helpers/leveling.helper';
import { registeringFONT, experienceFormula, formatNumber } from '../../lib/utils';
import { TextRankButtonRow, VoiceRankButtonRow } from '../../shared/bot/buttons/LevelingButtonts';

@ApplyOptions<Command.Options>({
    description: 'Check any user rank',
    aliases: ['level', 'r'],
})

export class RankCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand({
            name: this.name,
            description: this.description
        });
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const msg = await interaction.reply({ content: 'Ping?', fetchReply: true });
        const content = `Pong! Bot Latency ${Math.round(this.container.client.ws.ping)}ms. API Latency ${msg.createdTimestamp - interaction.createdTimestamp}ms.`;
        return interaction.editReply({ content });
    }

    public override async messageRun(message: Message, args: Args) {
        await message.channel.sendTyping()
        const guildId = message.guildId!;
        const voiceEnabled = await LevelingHelper.getVoiceXPEnabled(guildId);
        const textEnabled = await LevelingHelper.getTextXPEnabled(guildId);

        if (!voiceEnabled && !textEnabled) {
            await reply(message, { content: await resolveKey(message, `commands/replies/level:rank_not_enabled`) });
            return;
        }

        if (voiceEnabled) {
            await this.buildVoiceCard(message, args);
        } else if (textEnabled) {
            await this.buildTextCard(message, args);
        }
    }

    private async buildVoiceCard(message: Message, args: Args): Promise<void> {
        registeringFONT();
        const user = await args.pick('user').catch(() => message.author);

        if (user.bot) {
            await message.edit({ content: await resolveKey(message, `commands/replies/level:rank_bot`) });
            return;
        }

        const info = await LevelingHelper.getVoiceUserInfo(user.id, message.guildId!);
        if (!info) {
            await reply(message, { content: await resolveKey(message, `commands/replies/level:rank_not_data`) });
            return;
        }

        const rank = await LevelingHelper.getVoiceRank(user.id, message.guildId!);
        const level = info.voiceLevel ?? 0;
        const experience = info.voiceExperience ?? 0;
        const requiredXP = experienceFormula(level + 1);
        const formattedRank = formatNumber(rank ?? 0);

        const avatarURL = user.displayAvatarURL({ extension: 'jpg', size: 512 });
        const buffer = await DrawCanvas.generateUserRankImage(
            { userId: user.id, username: user.username, displayAvatarURL: user.displayAvatarURL, textExperience: experience, level },
            message.guild?.id!,
            formattedRank,
            requiredXP,
            experience,
            avatarURL
        );

        await reply(message, {
            components: [TextRankButtonRow],
            files: [{ attachment: buffer, name: 'rank.png' }]
        });
    }

    private async buildTextCard(message: Message, args: Args): Promise<void> {
        registeringFONT();
        const user = await args.pick('user').catch(() => message.author);

        if (user.bot) {
            await reply(message, { content: await resolveKey(message, `commands/replies/level:rank_bot`) });
            return;
        }

        const info = await LevelingHelper.getTextUserInfo(user.id, message.guildId!);
        if (!info) {
            await reply(message, { content: await resolveKey(message, `commands/replies/level:rank_not_data`) });
            return;
        }

        const rank = await LevelingHelper.getTextRank(message.member!.user.id, message.guildId!);
        const level = info.textLevel ?? 0;
        const experience = info.textExperience ?? 0;
        const requiredXP = experienceFormula(level ?? + 1);
        const formattedRank = formatNumber(rank ?? 0);
        const avatarURL = user.displayAvatarURL({ extension: 'jpg', size: 256 });
        const buffer = await DrawCanvas.generateUserRankImage(
            {
                userId: user.id,
                username: user.username,
                displayAvatarURL: user.displayAvatarURL,
                textExperience: experience,
                level
            },
            message.guild?.id!,
            formattedRank,
            requiredXP,
            experience,
            avatarURL
        );

        await reply(message, {

            components: [VoiceRankButtonRow],
            files: [{ attachment: buffer, name: 'rank.png' }]
        });
    }
}