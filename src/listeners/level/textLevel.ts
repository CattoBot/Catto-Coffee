import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import { GuildMember, Message, TextChannel } from "discord.js";
import { EnabledTextListenerExperience } from "../../lib/decorators/ListenerTextExpEnabled";
import { globalexperienceFormula, textExperienceFormula } from "../../lib/utils";

@ApplyOptions<Listener.Options>({ event: Events.MessageCreate })
export class TextLevelingCoreModule extends Listener<typeof Events.MessageCreate> {
    constructor(context: Listener.LoaderContext, options: Listener.LoaderContext) {
        super(context, { ...options, once: false });
    }

    @EnabledTextListenerExperience()
    public async run(message: Message) {
        if (!message.guild || message.author.bot || !message.inGuild()) return;

        const { min, max, cooldown } = await this.getMinMaxEXP(message);
        const cooldownKey = this.getCooldownKey(message.guild.id, message.author.id);
        const remainingCooldown = await this.container.redis.ttl(cooldownKey);

        if (remainingCooldown > 0) {
            return;
        }

        await this.setCooldown(cooldownKey, cooldown);
        const userExp = await this.getUserExperience(message.guild.id, message.author.id);
        const randomXP = this.getRandomXP(min, max);
        let { updatedExp, currentLevel } = this.calculateUpdatedExperience(userExp, randomXP);
        const nextLevelExp = textExperienceFormula(currentLevel);

        if (updatedExp >= nextLevelExp) {
            currentLevel += 1;
            updatedExp -= nextLevelExp;
            await this.sendLevelUpNotification(message, currentLevel);
            await this.assignRoles(message.member as GuildMember, message.guild.id, currentLevel);
        }

        await this.updateUserExperience(message.guild.id, message.author.id, updatedExp, currentLevel, randomXP, userExp);
        await this.updateGlobalExperience(message.author.id);
    }


    private async setCooldown(cooldownKey: string, cooldown: number) {
        await this.container.redis.set(cooldownKey, "1", "EX", cooldown);
    }

    private async getUserExperience(guildId: string, userId: string) {
        return this.container.prisma.text_experience.findUnique({
            where: { guildId_userId: { guildId, userId } }
        });
    }

    private getRandomXP(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private calculateUpdatedExperience(userExp: any, randomXP: number) {
        let updatedExp = (userExp?.textExperience || 0) + randomXP;
        let currentLevel = userExp?.textLevel || 0;
        return { updatedExp, currentLevel };
    }

    private async sendLevelUpNotification(message: Message, currentLevel: number) {
        const messageToSend = await this.getAchievementMessage(message.guild!.id);
        const notificationChannelId = await this.getTextNotificationChannel(message.guild!.id);
        const notificationChannel = notificationChannelId
            ? (await message.guild!.channels.fetch(notificationChannelId)) as TextChannel
            : null;

        const replacementMessage = messageToSend.replace(/{user}/g, message.author.toString()).replace(/{level}/g, currentLevel.toString());

        if (notificationChannel) {
            await notificationChannel.send(replacementMessage);
        } else {
            await message.reply(replacementMessage);
        }
    }

    private async updateUserExperience(guildId: string, userId: string, updatedExp: number, currentLevel: number, randomXP: number, userExp: any) {
        const data = {
            textExperience: updatedExp,
            textLevel: currentLevel,
            totalTextExperience: (userExp?.totalTextExperience || 0) + randomXP
        };
        await this.container.prisma.text_experience.upsert({
            where: { guildId_userId: { guildId, userId } },
            update: data,
            create: { guildId, userId, ...data }
        });
    }

    private async updateGlobalExperience(userId: string) {
        const user = await this.container.prisma.users.findUnique({
            where: { userId },
            select: { globalExperience: true, globalLevel: true }
        });

        const experience = Math.random() * 350;
        let currentExperience = user?.globalExperience || 0;
        let currentLevel = user?.globalLevel || 1;
        let newExperience = currentExperience + experience;
        let nextLevelExperience = globalexperienceFormula(currentLevel);
        while (newExperience >= nextLevelExperience) {
            newExperience -= nextLevelExperience;
            currentLevel++;
            nextLevelExperience = globalexperienceFormula(currentLevel);
        }
        await this.container.prisma.users.upsert({
            where: { userId },
            create: {
                userId,
                globalExperience: newExperience,
                globalLevel: currentLevel,
                totalGlobalExperience: experience,
                totalRegisteredMessages: 0,
                totalTimeInVoiceChannel: 0
            }, update: {
                totalGlobalExperience: { increment: experience },
                totalRegisteredMessages: { increment: 1 }
            }
        });
    }

    private async getMinMaxEXP(message: Message): Promise<{ min: number, max: number, cooldown: number }> {
        const guildID = message.guild?.id;
        if (!guildID) return { min: 5, max: 20, cooldown: 60 };
        const guildData = await this.container.prisma.i_text_experience.findUnique({ where: { guildId: guildID } });
        return {
            min: guildData?.min || 5,
            max: guildData?.max || 20,
            cooldown: guildData?.cooldown || 60
        };
    }

    private async getTextNotificationChannel(guildID: string): Promise<string | undefined> {
        const guildData = await this.container.prisma.i_text_experience.findUnique({ where: { guildId: guildID } });
        return guildData?.msgChannelId ?? undefined;
    }

    private async assignRoles(member: GuildMember, guildID: string, textLevel: number): Promise<void> {
        const rolesForLevel = await this.container.prisma.experience_role_rewards.findMany({
            where: { guildId: guildID, level: { lte: textLevel }, roleType: "Text" }
        });

        const roleIdsForLevel = new Set(rolesForLevel.map(role => role.roleId));
        const currentRoleIds = new Set(member.roles.cache.keys());
        const rolesToAssign = Array.from(member.guild.roles.cache.values()).filter(role => roleIdsForLevel.has(role.id) && !currentRoleIds.has(role.id));

        if (rolesToAssign.length > 0) {
            await member.roles.add(rolesToAssign).catch(() => null);
        }
    }

    private async getAchievementMessage(guildID: string): Promise<string> {
        const getMessage = await this.container.prisma.i_text_experience.findUnique({ where: { guildId: guildID } });
        return getMessage?.lvlUpMsg || 'Felicidades {user} has subido a nivel `{level}`.';
    }

    private getCooldownKey(guildID: string, userID: string): string {
        return `cooldown:text:${guildID}:${userID}`;
    }
}
