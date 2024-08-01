import { resolveKey, getLocalizedData } from "@sapphire/plugin-i18next";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { Emojis } from "../../../shared/enum/Emojis";
import { InteractionResponse, Message } from "discord.js";
import { container } from "@sapphire/pieces";
import { CattoSubcommandObject } from "../../../shared/types/Commands";
import { Args } from "@sapphire/framework";

export class VoiceGhostedCommand {
    public static async messageRun(message: Message, args: Args) {
        await message.channel.sendTyping();

        const status_brute = await args.pick('string').catch(() => null) as String | null;
        container.console.log(status_brute)

        const status = status_brute?.includes("y") ?? false

        const member = message.member;
        const channel = member!.voice.channel;
        
        try {
            container.services.tempvc.ghost(message, status, channel)
        } catch (error) {
            container.console.error(error)
            return message.reply({
                content: (await resolveKey(message, `commands/replies/error:error`)),
            });
        }
        return message.reply({
            content: (await resolveKey(message, `commands/replies/voice:ghost_success`, { emoji: Emojis.SUCCESS })),
        });
    }
    public static async chatInputRun(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse> {
        const user = interaction.user.id;
        const member = interaction.guild!.members.resolve(user);
        const channel = member!.voice.channel;
        const CMDroute = container.services.i18.getCommandRoute({
            commandName: 'voice',                          // Comando voice
            type: 'options',                               // Es una de las opciones
            ext: { key: 'statusGhosted', type: 'name' }    // Su key es "statusGhosted" y queremos obtener su nombre
        })
        const status = interaction.options.getString(getLocalizedData(CMDroute).value) == "y"

        try {
            container.services.tempvc.ghost(interaction, status, channel)
        } catch (error) {
            container.console.error(error)
            return interaction.reply({
                content: (await resolveKey(interaction, `commands/replies/error:error`)),
                ephemeral: true,
            });
        }
        return interaction.reply({
            content: (await resolveKey(interaction, `commands/replies/voice:ghost_success`, { emoji: Emojis.SUCCESS })),
        });
    }

    public static key:CattoSubcommandObject = {
        key: 'ghosted', options: [{
            type: 'string', key: 'statusGhosted', required: true,
            choices: [{ key: 'n', value: 'n' }, { key: 'y', value: 'y' }]
        }]
    }
}