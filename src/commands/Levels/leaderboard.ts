import { ApplyOptions } from '@sapphire/decorators';
import { Args, Command } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import { resolveKey } from '@sapphire/plugin-i18next';
import { type Message } from 'discord.js';
import { textExperienceFormula, experienceFormula } from '../../lib/utils';
import { LeaderboardImageBuilder } from '../../lib/classes/LeaderboardCard';
import { TextRankButtonRow, VoiceRankButtonRow } from '../../shared/bot/buttons/LevelingButtonts';
import { LevelingHelper } from '../../lib/helpers/leveling.helper';

@ApplyOptions<Command.Options>({
    description: 'Check the server leaderboard.',
    aliases: ['lb'],
})
export class RankLeaderboardCommand extends Command {
    public override async messageRun(message: Message, _args: Args) {
        await message.channel.sendTyping();
        const args = await _args.pick('string').catch(() => 'text');

        if (args === 'voice') {
            await this.buildVoiceLeaderboard(message);
        } else if (args === 'text') {
            await this.buildTextLeaderboard(message);
        } else {
            const voiceEnabled = await LevelingHelper.getVoiceXPEnabled(message.guild!.id);
            const textEnabled = await LevelingHelper.getTextXPEnabled(message.guild!.id);

            if (!voiceEnabled && !textEnabled) {
                await reply(message, { content: await resolveKey(message, `commands/replies/level:rank_not_enabled`) });
                return;
            }

            if (voiceEnabled) {
                await this.buildVoiceLeaderboard(message);
            } else if (textEnabled) {
                await this.buildTextLeaderboard(message);
            }
        }
    }

    private async buildVoiceLeaderboard(message: Message) {
        const guild_leaderboard = await LevelingHelper.getVoiceLeaderboard(message.guildId!);
        if (guild_leaderboard.length === 0) {
            await this.buildTextLeaderboard(message);
            await reply(message, { content: await resolveKey(message, `commands/replies/level:lb_not_data`) });
            return;
        }

        const userId = message.member!.user.id;
        const builder = new LeaderboardImageBuilder()
            .setGuildLeaderboard(guild_leaderboard)
            .setUserId(userId)
            .setBackground('../../../assets/img/Leader_VC_v2.jpg')
            .setExperienceFormula(experienceFormula)
            .setType('voice');

        const buffer = await builder.build();
        if (buffer) {
            await reply(message, { files: [{ attachment: buffer, name: 'leaderboard.png' }], components: [VoiceRankButtonRow] });
        } else {
            await reply(message, { content: await resolveKey(message, `commands/replies/level:lb_voice_user_not_data`) });
        }
    }

    private async buildTextLeaderboard(message: Message) {
        const guild_leaderboard = await LevelingHelper.getTextLeaderboard(message.guildId!);
        if (guild_leaderboard.length === 0) {
            await reply(message, { content: await resolveKey(message, `commands/replies/level:lb_not_data`) });
            return;
        }

        const userId = message.member!.user.id;
        const builder = new LeaderboardImageBuilder()
            .setGuildLeaderboard(guild_leaderboard)
            .setUserId(userId)
            .setBackground('../../../assets/img/Leader_TXT.png')
            .setExperienceFormula(textExperienceFormula)
            .setType('text');

        const buffer = await builder.build();
        if (buffer) {
            await reply(message, { files: [{ attachment: buffer, name: 'leaderboard.png' }], components: [TextRankButtonRow] });
        } else {
            await reply(message, { content: await resolveKey(message, `commands/replies/level:lb_voice_user_not_data`) });
        }
    }
}