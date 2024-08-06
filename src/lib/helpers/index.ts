import { VoiceState } from "discord.js";
import { VoiceDeleteHelper } from "./voice/voice.delete.helper";
import { VoiceCreateHelper } from "./voice/voice.create.helper";
import { trusted_voice_users } from "@prisma/client";
import { CanvaHelper } from "./canva.helper";
import { VoiceHelper } from "./voice.helper";
import { LevelingHelper } from "./leveling.helper";
import { RoleReward } from "../../shared/types/Rewards";
import { CanvasRenderingContext2D, Image } from "canvas";

export default class CoreHelper {
    private voiceDeleteHelper: VoiceDeleteHelper;
    private voiceCreateHelper: VoiceCreateHelper;
    private canvaHelper: CanvaHelper;
    private voiceHelper: VoiceHelper;
    private levelingHelper: LevelingHelper;

    constructor() {
        this.voiceDeleteHelper = new VoiceDeleteHelper();
        this.voiceCreateHelper = new VoiceCreateHelper();
        this.canvaHelper = new CanvaHelper();
        this.voiceHelper = new VoiceHelper();
        this.levelingHelper = new LevelingHelper();

        this.voiceChannels = {
            queueEvent: this.voiceDeleteHelper.queueEvent.bind(this.voiceDeleteHelper),
            initChannel: this.voiceCreateHelper.initChannel.bind(this.voiceCreateHelper),
        };

        this.canvas = {
            getUserBadges: this.canvaHelper.getUserBadges.bind(this.canvaHelper),
            getGuildBadges: this.canvaHelper.getGuildBadges.bind(this.canvaHelper),
            registerFonts: this.canvaHelper.registerFonts.bind(this.canvaHelper),
            drawProgressBar: this.canvaHelper.drawProgressBar.bind(this.canvaHelper),
            wrapText: this.canvaHelper.wrapText.bind(this.canvaHelper),
            drawFormattedRank: this.canvaHelper.drawFormattedRank.bind(this.canvaHelper),
            drawUserAvatar: this.canvaHelper.drawUserAvatar.bind(this.canvaHelper),
            drawRoundedImage: this.canvaHelper.drawRoundedImage.bind(this.canvaHelper),
            drawUserData: this.canvaHelper.drawUserData.bind(this.canvaHelper),
            drawProgressBarForUser: this.canvaHelper.drawProgressBarForUser.bind(this.canvaHelper),
            registeringFONT: this.canvaHelper.registeringFONT.bind(this.canvaHelper)
        };

        this.voice = {
            find: this.voiceHelper.find.bind(this.voiceHelper),
            findTrusted: this.voiceHelper.findTrusted.bind(this.voiceHelper),
            store: this.voiceHelper.store.bind(this.voiceHelper),
            getVoiceChannelOwner: this.voiceHelper.getVoiceChannelOwner.bind(this.voiceHelper),
            findUser: this.voiceHelper.findUser.bind(this.voiceHelper),
            delete: this.voiceHelper.delete.bind(this.voiceHelper),
        };

        this.leveling = {
            getVoiceXPEnabled: this.levelingHelper.getVoiceXPEnabled.bind(this.levelingHelper),
            getTextXPEnabled: this.levelingHelper.getTextXPEnabled.bind(this.levelingHelper),
            getTextLeaderboard: this.levelingHelper.getTextLeaderboard.bind(this.levelingHelper),
            getVoiceLeaderboard: this.levelingHelper.getVoiceLeaderboard.bind(this.levelingHelper),
            getTextRewards: this.levelingHelper.getTextRewards.bind(this.levelingHelper),
            getVoiceRewards: this.levelingHelper.getVoiceRewards.bind(this.levelingHelper),
            getVoiceRank: this.levelingHelper.getVoiceRank.bind(this.levelingHelper),
            getTextRank: this.levelingHelper.getTextRank.bind(this.levelingHelper),
            getVoiceUserInfo: this.levelingHelper.getVoiceUserInfo.bind(this.levelingHelper),
            getTextUserInfo: this.levelingHelper.getTextUserInfo.bind(this.levelingHelper),
        }
    }

    voiceChannels: {
        initChannel: (newState: VoiceState, oldState: VoiceState) => Promise<void>;
        queueEvent: (oldState: VoiceState, newState: VoiceState) => Promise<void>;
    };

    canvas: {
        getUserBadges: (userId: string) => Promise<any>;
        getGuildBadges: (guildId: string) => Promise<any>;
        registerFonts: () => void;
        drawProgressBar: (
            context: CanvasRenderingContext2D,
            x: number,
            y: number,
            width: number,
            height: number,
            progress: number,
            startColor?: string,
            endColor?: string
        ) => void;
        wrapText: (
            context: CanvasRenderingContext2D,
            text: string,
            x: number,
            y: number,
            maxWidth: number,
            maxHeight: number,
            lineHeight: number
        ) => void;
        drawFormattedRank: (
            context: CanvasRenderingContext2D,
            rank: string,
            x: number,
            y: number
        ) => void;
        drawUserAvatar: (
            context: CanvasRenderingContext2D,
            image: Image,
            x: number,
            y: number,
            size: number
        ) => void;
        drawRoundedImage: (
            context: CanvasRenderingContext2D,
            image: Image,
            x: number,
            y: number,
            size: number
        ) => void;
        drawUserData: (
            context: CanvasRenderingContext2D,
            username: string,
            level: string,
            xp: string,
            x: number,
            y: number
        ) => void;
        drawProgressBarForUser: (
            context: CanvasRenderingContext2D,
            progress: number,
            x: number,
            y: number,
            width: number,
            height: number,
            startColor?: string,
            endColor?: string
        ) => void;
        registeringFONT: () => void;
    };

    voice: {
        find: (channel_id: string, guild_id: string) => Promise<any>;
        findTrusted: (channelId: string, guildId: string, userId: string) => Promise<any>;
        store: (channelId: string, userId: string, guildId: string) => Promise<trusted_voice_users>;
        getVoiceChannelOwner: (channelId: string, guildId: string) => Promise<string | null>;
        findUser: (channelId: string, guildId: string, userId: string) => Promise<any>;
        delete: (channelId: string, userId: string, guildId: string) => Promise<trusted_voice_users>;
    };

    leveling: {
        getVoiceXPEnabled: (guildId: string) => Promise<boolean>;
        getTextXPEnabled: (guildId: string) => Promise<boolean>;
        getTextLeaderboard: (guildId: string) => Promise<any>;
        getVoiceLeaderboard: (guildId: string) => Promise<any>;
        getTextRewards: (guildId: string) => Promise<RoleReward[]>;
        getVoiceRewards: (guildId: string) => Promise<RoleReward[]>;
        getVoiceRank: (userId: string, guildId: string) => Promise<number | undefined>;
        getTextRank: (userId: string, guildId: string) => Promise<number | undefined>;
        getVoiceUserInfo: (userId: string, guildId: string) => Promise<any>;
        getTextUserInfo: (userId: string, guildId: string) => Promise<any>;
    }
}
