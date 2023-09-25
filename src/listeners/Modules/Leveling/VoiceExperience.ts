import { TextChannel, Guild, GuildMember, Channel } from "discord.js";
import { Listener, Events } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { Database } from "../../../structures/Database";
import { GetRandomXP, XPCalculator } from "../../../util/utilities/index";
import { Utils } from "../../../util/utils";
import { Catto_Coffee } from "../../../Catto";

interface GuildData {
    VoiceExpEnabled: boolean;
    VoiceExperienceMin?: number;
    VoiceExperienceMax?: number;
    VoiceDefaultMessage?: string;
}

export class VoiceExperienceListener extends Listener {
    private readonly minMaxExpCache: Map<string, { min: number; max: number }> = new Map();
    private readonly notificationMessageCache: Map<string, string> = new Map();
    private guildsDataCache: { [guildID: string]: GuildData } = {};

    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            event: Events.ClientReady,
        });
    }

    public async run() {
        await this.processGuilds();
        setTimeout(() => {
            this.run();
        }, Time.Second * Utils.getCooldowns().Voice);
    }

    private async processGuilds() {
        Catto_Coffee.guilds.cache.forEach(async (guild) => {
            await this.processGuild(guild);
        });
    }

    private async processGuild(guild: Guild) {
        const isEnabled = await this.isVoiceExperienceModuleEnabled(guild);

        if (!isEnabled) {
            return;
        }

        const afkChannel = guild.afkChannel;
        const voiceChannelMembers = Array.from(guild.voiceStates.cache.values()).filter((vs) =>
            vs.channel &&
            !vs.member?.user.bot &&
            !vs.member?.voice.selfMute &&
            !vs.member?.voice.selfDeaf &&
            !vs.member?.voice.serverDeaf &&
            !vs.member?.voice.serverMute &&
            vs.member?.voice.channelId !== afkChannel?.id
        );

        for (const voiceState of voiceChannelMembers) {
            const { min, max } = await this.getMinMaxEXP(guild);
            const experience = await GetRandomXP(min, max);

            const updatedUser = await this.updateVoiceExperience(voiceState.member, guild.id, experience, min, max);
            if (updatedUser.levelUp) {
                await this.handleLevelUp(voiceState.member, guild.id, updatedUser.Nivel);
            }
        }
    }

    private async isVoiceExperienceModuleEnabled(guild: Guild) {
        const data = await Database.guildsData.findUnique({ where: { GuildID: guild.id } });
        if (data) {
            this.guildsDataCache[guild.id] = data;
            return data.VoiceExpEnabled;
        }
        return false;
    }

    private async getMinMaxEXP(guild: Guild) {
        const guildID = guild.id as string;
        const cachedValue = this.minMaxExpCache.get(guildID);

        if (cachedValue && this.areMinMaxValuesUpToDate(cachedValue, guildID)) {
            return cachedValue;
        }

        const guildData = await Database.guildsData.findUnique({ where: { GuildID: guildID } });
        const minMaxExp = {
            min: guildData?.VoiceExperienceMin ?? 5,
            max: guildData?.VoiceExperienceMax ?? 20,
        };

        this.minMaxExpCache.set(guildID, minMaxExp);
        return minMaxExp;
    }

    private areMinMaxValuesUpToDate(cachedValue: { min: number; max: number }, guildID: string) {
        const guildData = this.guildsDataCache[guildID];
        return guildData && cachedValue.min === guildData.VoiceExperienceMin && cachedValue.max === guildData.VoiceExperienceMax;
    }

    private async updateVoiceExperience(member: GuildMember, guildID: string, experience: number, min: number, max: number) {
        const { id: UserID } = member.user;

        const updatedUser = await Database.usersVoiceExperienceData.upsert({
            where: { UserID_GuildID: { UserID, GuildID: guildID } },
            create: { UserID, GuildID: guildID, VoiceExperience: experience, TotalExperience: experience },
            update: { VoiceExperience: { increment: experience }, TotalExperience: { increment: experience } },
        });

        const randInt = await GetRandomXP(min, max);
        let levelUp = false;

        if (updatedUser) {
            updatedUser.VoiceExperience += randInt;
            updatedUser.TotalExperience += randInt;

            const xpHastaNivel = XPCalculator(updatedUser.Nivel);

            if (updatedUser.VoiceExperience >= xpHastaNivel) {
                updatedUser.VoiceExperience -= xpHastaNivel;
                updatedUser.Nivel++;
                levelUp = true;
            }

            await Database.usersVoiceExperienceData.update({
                where: { UserID_GuildID: { UserID, GuildID: guildID } },
                data: { Nivel: updatedUser.Nivel, VoiceExperience: Math.floor(updatedUser.VoiceExperience), TotalExperience: updatedUser.TotalExperience }
            });

            this.minMaxExpCache.delete(guildID);
        }

        return { ...updatedUser, levelUp };
    }

    private async handleLevelUp(member: GuildMember, guildID: string, userNivel: number) {
        await this.getNotificationChannel(guildID, member.user.id, userNivel);
        await this.AddMissingRoles(member, guildID, userNivel);
    }

    private async AddMissingRoles(member: GuildMember, guildID: string, userNivel: number) {
        const existingRoles = member.roles.cache;
        const voiceRoles = await Database.voiceRoleRewards.findMany({ where: { GuildID: guildID, Nivel: { lte: userNivel } }, orderBy: { Nivel: "asc" } });
        const rolesToAdd: string[] = [];

        for (const voiceRole of voiceRoles) {
            const roleID: string = voiceRole.RoleID;
            if (!existingRoles.has(roleID)) {
                rolesToAdd.push(roleID);
            }
        }

        if (rolesToAdd.length > 0) {
            await member.roles.add(rolesToAdd).catch(() => { });
        }
    }

    private async getNotificationChannel(GuildID: string, UserID: string, userNivel: number) {
        let message = await this.getNotificationMessage(GuildID);
        const userMention = `<@${UserID}>`;
        const messageWithUserAndNivel = message.replace(/\{user\}/g, userMention).replace(/\{level\}/g, userNivel.toString());
        const getChannel = await Database.configChannels.findUnique({ where: { GuildID: GuildID } });
        const getVoiceAchievementChannel = getChannel?.VcXPNotification as string;
        const VoiceAchievementChannel = this.getChannelFromCache(getVoiceAchievementChannel) as TextChannel;

        if (VoiceAchievementChannel) {
            VoiceAchievementChannel.send(messageWithUserAndNivel);
        }
    }

    private async getNotificationMessage(GuildID: string): Promise<string> {
        const cachedMessage = this.notificationMessageCache.get(GuildID);

        if (cachedMessage && this.isNotificationMessageUpToDate(cachedMessage, GuildID)) {
            return cachedMessage;
        }

        const guildData = await Database.guildsData.findUnique({ where: { GuildID: GuildID } });
        const notificationMessage = guildData?.VoiceDefaultMessage ?? "¡Felicidades {user}! has subido a nivel `{level}` en canales de voz. **¡GG!**";

        this.notificationMessageCache.set(GuildID, notificationMessage);
        return notificationMessage;
    }

    private isNotificationMessageUpToDate(cachedMessage: string, guildID: string) {
        const guildData = this.guildsDataCache[guildID];
        return guildData && cachedMessage === guildData.VoiceDefaultMessage;
    }

    private getChannelFromCache(channelID: string): Channel | undefined {
        return Catto_Coffee.channels.cache.get(channelID);
    }
}