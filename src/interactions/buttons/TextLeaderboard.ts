import { container, InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { createCanvas, loadImage } from 'canvas';
import type { ButtonInteraction, User } from 'discord.js';
import { join } from 'path';
import { formatNumber, drawRoundedImage, drawProgressBar, drawUserAvatar, drawFormattedRank, drawUserData, drawProgressBarForUser, experienceFormula } from '../../lib/utils';
import { VoiceRankButtonOnly } from '../../shared/bot/buttons/LevelingButtonts';
import { resolveKey } from '@sapphire/plugin-i18next';
import { CheckTextExperienceEnabled } from '../../lib/decorators/InteractionTextExpEnabled';

export class ButtonTextLeaderboardHandler extends InteractionHandler {
    public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    }

    public override parse(interaction: ButtonInteraction) {
        if (interaction.customId !== 'text-lb') return this.none();
        return this.some();
    }

    @CheckTextExperienceEnabled
    public async run(interaction: ButtonInteraction) {
        console.time('Leaderboard.run');

        const guild_leaderboard = await this.getTextLeaderboard(interaction.guildId!);
        if (guild_leaderboard.length === 0) {
            await interaction.reply({ content: await resolveKey(interaction, `commands/replies/level:lb_not_data`) });
            console.timeEnd('ButtonVoiceLeaderboardHandler.run');
            return;
        }

        const top10 = guild_leaderboard.slice(0, 10);
        const userRank = guild_leaderboard.findIndex((user) => user.userId === interaction.member!.user.id) + 1;
        if (userRank === 0) {
            await interaction.reply({ content: await resolveKey(interaction, 'commands/replies/level:lb_voice_user_not_data') });
            console.timeEnd('ButtonVoiceLeaderboardHandler.run');
            return;
        }

        const userdata = guild_leaderboard.find((user) => user.userId === interaction.member!.user.id);
        const [avatarloadimage, backgroundImage] = await Promise.all([
            loadImage(interaction.user.displayAvatarURL({ extension: 'jpg', size: 64 })),
            loadImage(join(__dirname, '../../../assets/img/Leader_TXT.jpg'))
        ]);

        const imageWidth = 1024;
        const imageHeight = 1440;
        const canvas = createCanvas(imageWidth, imageHeight);
        const context = canvas.getContext('2d');
        context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

        const fetchUserData = async (user: any) => {
            const member = await container.client.users.fetch(user.userId) as User;
            const avatar = await loadImage(member.displayAvatarURL({ extension: 'jpg', size: 64 }));
            return {
                userInfo: `${member.username} \n Level: ${user.textLevel} - XP: ${formatNumber(user.textExperience ?? 0)}`,
                avatar
            };
        };

        const results = await Promise.all(top10.map(fetchUserData));
        const lb = results.map(result => result.userInfo);
        const userAvatars = results.map(result => result.avatar);

        const colors = [
            { start: '#f4b547', end: '#faf3bb' },
            { start: '#04a0ff', end: '#03ddcd' },
            { start: '#ff5394', end: '#ff7064' }
        ];

        let y = Math.floor(imageHeight / 9.6);
        const lineHeight = Math.floor(imageHeight / 10);
        const avatarSpacing = -27.5;
        const avatarSize = Math.floor(imageHeight / 14);

        for (const [index, user] of lb.entries()) {
            const avatar = userAvatars[index];
            const avatarX = imageWidth * 0.12;
            const avatarY = y + lineHeight / 2 - avatarSize;
            drawRoundedImage(context, avatar, avatarX, avatarY, avatarSize);
            const textX = avatarX + avatarSize + Math.floor(imageWidth * 0.03);
            const textY = avatarY + avatarSize / 2 + 6 - Math.floor(imageHeight * 0.02);
            const [username, xp] = user.split(' - XP: ');
            context.font = '16px Poppins SemiBold';
            context.fillStyle = '#000000';
            context.textAlign = 'left';
            context.fillText(username, textX, textY);
            const xpTextWidth = context.measureText(xp).width;
            const xpX = imageWidth - Math.floor(imageWidth * 0.09) - xpTextWidth;
            context.fillText('XP: ' + xp, xpX, textY);
            const progress = top10[index].textExperience! / experienceFormula(top10[index].textLevel! + 1);
            const progressBarX = textX;
            const progressBarY = textY + 30;
            const progressBarWidth = 720;
            const progressBarHeight = 15;
            const color = index < 3 ? colors[index] : { start: '#12D6DF', end: '#F70FFF' };
            drawProgressBar(context, progressBarX, progressBarY, progressBarWidth, progressBarHeight, progress, color.start, color.end);
            y += lineHeight + avatarSpacing;
        }

        const userBlockX = 100;
        const userBlockY = 1290;

        const userAvatarSize = Math.floor(imageHeight / 15);
        const userAvatarX = userBlockX;
        const userAvatarY = userBlockY;
        drawUserAvatar(context, avatarloadimage, userAvatarX, userAvatarY, userAvatarSize);

        const baseOffset = Math.floor(imageWidth * 0.002);
        const rankX = userAvatarX - baseOffset - 15;
        const rankY = userAvatarY + userAvatarSize / 2 + 6 + 4;
        drawFormattedRank(context, formatNumber(userRank), rankX, rankY);

        const userDataX = userAvatarX + userAvatarSize + Math.floor(imageWidth * 0.03);
        const userDataY = userAvatarY + 20;
        drawUserData(context, interaction.member!.user.username, formatNumber(userdata?.textLevel!), formatNumber(userdata?.textExperience!), userDataX, userDataY);

        const progressForUser = userdata?.textExperience! / experienceFormula(userdata?.textLevel! + 1);
        const progressBarForUserX = userDataX;
        const progressBarForUserY = userDataY + 40;
        const progressBarForUserWidth = 720;
        const progressBarForUserHeight = 15;
        const userColor = userRank <= 3 ? colors[userRank - 1] : { start: '#12D6DF', end: '#F70FFF' };
        drawProgressBarForUser(context, progressForUser, progressBarForUserX, progressBarForUserY, progressBarForUserWidth, progressBarForUserHeight, userColor.start, userColor.end);

        const buffer = canvas.toBuffer('image/png');
        await interaction.update({ files: [{ attachment: buffer, name: 'leaderboard.png' }], components: [VoiceRankButtonOnly] });
        console.timeEnd('Leaderboard.run');
        return;
    }

    private async getTextLeaderboard(guildId: string) {
        const lb = await container.prisma.textExperience.findMany({
            where: {
                guildId: guildId
            }, orderBy: [
                {
                    textLevel: 'desc'
                },
                {
                    textExperience: 'desc'
                }

            ]
        });

        return lb;
    }
}