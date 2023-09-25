import { CommandInteraction, Message, Colors, EmbedBuilder } from "discord.js";

export class Utils {
    private static instance: Utils;
    private static readonly Emojis = {
        General: {
            Success: process.env.SUCCESS_EMOJI,
            Error: process.env.ERROR_EMOJI,
            Warning: process.env.WARNING_EMOJI,
        },
        VoiceMod: {
            selfMuted: process.env.VOICEMOD_SELFMUTED,
            serverMuted: process.env.VOICEMOD_SERVERMUTED,
            selfDeafen: process.env.VOICEMOD_SELFDEAFEN,
            serverDeafen: process.env.VOICEMOD_SERVERDEAFEN,
            unmute: process.env.VOICEMOD_UNMUTE,
            undeafen: process.env.VOICEMOD_UNDEAFEN,
            mod: process.env.VOICEMOD_MOD,
            admin: process.env.VOICEMOD_ADMIN,
        }
    };

    private static readonly Colors = {
        Main: Colors.White,
        Error: Colors.Red,
        Warn: Colors.Yellow,
    };

    private static readonly Links = {
        Documentation: process.env.DOCUMENTATION,
        TopGG: process.env.TOPGG_LINK,
        Support: process.env.SUPPORT_SERVER,
    };

    private static readonly Cooldowns = {
        Text: parseInt(process.env.TEXT_COOLDOWN) || 10,
        Voice: parseInt(process.env.VOICE_COOLDOWN) || 10,
        VoiceCreate: parseInt(process.env.VOICE_CREATE_COOLDOWN) || 10, // Seconds
    };

    private static readonly Messages = {
        InteractionOwner: {
            Button: "Este botón no te pertenece.",
            SelectMenu: "Este menú no te pertenece.",
        }
    }

    public static getUtils(): Utils {
        if (!Utils.instance) {
            Utils.instance = new Utils();
        }
        return Utils.instance;
    }

    public static async interactionEmbed(interaction: CommandInteraction, data: string) {
        const embed = new EmbedBuilder()
            .setAuthor({
                name: interaction.client.user.tag,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setColor(Utils.Colors.Main)
            .setDescription(Utils.limitText(data));

        if (interaction.deferred) {
            await interaction.followUp({ embeds: [embed] });
        } else {
            await interaction.reply({ embeds: [embed] });
        }

    }

    public static async messageEmbed(message: Message, data: string) {
        const embed = new EmbedBuilder()
            .setColor(Utils.Colors.Main)
            .setDescription(Utils.limitText(data));
        await message.reply({ embeds: [embed] });
    }

    public static getEmojis() {
        return Utils.Emojis;
    }

    public static getColors() {
        return Utils.Colors;
    }

    public static getDocs() {
        return Utils.Links;
    }

    public static getCooldowns() {
        return Utils.Cooldowns;
    }

    public static getMessages() {
        return Utils.Messages;
    }

    private static limitText(text: string) {
        return text.substring(0, 3000);
    }
}
