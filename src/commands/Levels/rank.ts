import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import { resolveKey } from '@sapphire/plugin-i18next';
import { User, type Message } from 'discord.js';
import { LevelingHelper } from '../../lib/helpers/leveling.helper';
import { TextRankButtonRow, VoiceRankButtonRow } from '../../shared/bot/buttons/LevelingButtonts';
import { Emojis } from '../../shared/enum/Emojis';
import { RankCardBuilder } from '../../lib/classes/RankCard';
import { AvatarExtension } from '../../shared/interfaces/UserInfo';
import { voice_experience as VoiceExperience, text_experience as TextExperience } from '@prisma/client';

@ApplyOptions<Command.Options>({
    description: 'Check any user rank',
    aliases: ['level', 'r'],
})
export class RankCommand extends Command {
    public override async messageRun(message: Message, args: Args) {
        await message.channel.sendTyping();
        const guildId = message.guildId!;
        const [voiceEnabled, textEnabled] = await Promise.all([
            LevelingHelper.getVoiceXPEnabled(guildId),
            LevelingHelper.getTextXPEnabled(guildId),
        ]);

        if (!voiceEnabled && !textEnabled) {
            await reply(message, { content: await resolveKey(message, 'commands/replies/level:rank_not_enabled') });
            return;
        }

        const user = await args.pick('user').catch(() => message.author);
        let type: 'voice' | 'text' = await args.pick('string').catch(() => 'text') as 'voice' | 'text';

        if (type !== 'voice' && type !== 'text') {
            await reply(message, { content: await resolveKey(message, 'commands/replies/level:rank_invalid_type') });
            return;
        }

        if ((type === 'voice' && !voiceEnabled) || (type === 'text' && !textEnabled)) {
            type = type === 'text' && voiceEnabled ? 'voice' : 'text';
            if ((type === 'voice' && !voiceEnabled) || (type === 'text' && !textEnabled)) {
                await reply(message, { content: await resolveKey(message, `commands/replies/level:rank_${type}_disabled`) });
                return;
            }
        }

        await this.buildCard(message, user, type);
    }

    private async buildCard(message: Message, user: User, type: 'voice' | 'text'): Promise<void> {
        if (user.bot) {
            await reply(message, { content: await resolveKey(message, 'commands/replies/level:rank_bot') });
            return;
        }

        let info: VoiceExperience | TextExperience | null = type === 'voice' ?
            await LevelingHelper.getVoiceUserInfo(user.id, message.guildId!) :
            await LevelingHelper.getTextUserInfo(user.id, message.guildId!);

        if (!info) {
            type = type === 'text' ? 'voice' : 'text';
            info = type === 'voice' ?
                await LevelingHelper.getVoiceUserInfo(user.id, message.guildId!) :
                await LevelingHelper.getTextUserInfo(user.id, message.guildId!);

            if (!info) {
                await reply(message, { content: await resolveKey(message, 'commands/replies/level:rank_not_data') });
                return;
            }
        }

        const rank = type === 'voice' ?
            await LevelingHelper.getVoiceRank(user.id, message.guildId!) :
            await LevelingHelper.getTextRank(user.id, message.guildId!);

        const level = this.getLevel(info, type);
        const experience = this.getExperience(info, type);
        const requiredXP = type === 'voice' ? this.container.utils.xp.experienceFormula(level + 1) : this.container.utils.xp.textExperienceFormula(level + 1);
        const formattedRank = this.container.utils.numbers.format(rank ?? 0);
        const avatarURL = user.displayAvatarURL({ extension: 'jpg', size: 512 });

        const userInfo = {
            userId: user.id,
            username: user.username,
            displayAvatarURL: (options: { extension: AvatarExtension; size: 512 }) => user.displayAvatarURL(options),
            level: level,
            experience: experience,
            displayName: user.displayName,
        };

        const card = new RankCardBuilder()
            .setAvatarURL(avatarURL)
            .setExperience(experience)
            .setGuildId(message.guildId!)
            .setRank(formattedRank)
            .setRequiredXP(requiredXP)
            .setUser(userInfo);

        const buffer = await card.build();
        const buttonRow = type === 'voice' ? TextRankButtonRow : VoiceRankButtonRow;
        const ViewingText = await resolveKey(message, `commands/replies/level:text_card`, { emoji: Emojis.SUCCESS, user: user.displayName })
        const ViewingVoice = await resolveKey(message, `commands/replies/level:voice_card`, { emoji: Emojis.SUCCESS, user: user.displayName })

        const content = type === 'voice' ? ViewingVoice : ViewingText;

        await reply(message, {
            content: content,
            components: [buttonRow],
            files: [{ attachment: buffer, name: 'rank.png' }],
        });
    }

    private getLevel(info: VoiceExperience | TextExperience, type: 'voice' | 'text'): number {
        return type === 'voice' ? (info as VoiceExperience).voiceLevel ?? 0 : (info as TextExperience).textLevel ?? 0;
    }

    private getExperience(info: VoiceExperience | TextExperience, type: 'voice' | 'text'): number {
        return type === 'voice' ? (info as VoiceExperience).voiceExperience ?? 0 : (info as TextExperience).textExperience ?? 0;
    }
}
