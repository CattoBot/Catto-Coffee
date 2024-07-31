import { container } from "@sapphire/pieces";
import { ChatInputCommandInteraction, Message, VoiceBasedChannel } from "discord.js";

export class TempVCService {

    /**
     * @param actioner Interacción o mensaje que han solicitado la activación del servicio
     * @param state ¿Debe el canal ser ocultado?
     * @param channel Canal afectado
     * @returns 
     */
    public static async ghost(actioner:ChatInputCommandInteraction | Message, status:boolean, channel:VoiceBasedChannel | null): Promise<void> {
        const users_current_permissions = channel!.permissionOverwrites.resolve(channel!.guild.roles.everyone.id);
        try {
            await channel!.permissionOverwrites.edit(actioner.guild!.roles.everyone, {
                ...users_current_permissions,
                ViewChannel: !status,
            });
        } catch (error) {
            container.console.error(error)
            throw new Error(`Imposible to ${status?"":"un"}ghost the channel`)
        }
        return
    }

    public static async lock(actioner:ChatInputCommandInteraction | Message, status:boolean, channel:VoiceBasedChannel | null): Promise<void> {
        const users_current_permissions = channel!.permissionOverwrites.resolve(channel!.guild.roles.everyone.id);
        try {
            await channel!.permissionOverwrites.edit(actioner.guild!.roles.everyone, {
                ...users_current_permissions,
                Connect: !status
            });
        } catch (error) {
            container.console.error(error)
            throw new Error(`Impossible to ${status?"":"un"}lock the channel`)
        }
    }
}