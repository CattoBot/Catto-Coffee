import { Args } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Message } from "discord.js";
import { Emojis } from "../../../shared/enum/Emojis";

export class VoiceNameCommand {
    public static async messageRun(message: Message, args: Args): Promise<void> {
        await message.channel.sendTyping();
        const name = await args.rest('string').catch(() => null) as string | null;
        if (!name) {
            await message.reply({
                content: (await resolveKey(message, 'commands/replies/voice:voice_name_not_provided', { emoji: Emojis.ERROR }))
            });
            return;
        }
        await message.member?.voice.channel?.setName(name.toString());
        await message.reply({
            content:
                (await resolveKey(message, 'commands/replies/voice:voice_name_success', { emoji: Emojis.SUCCESS, name: name }))
        });
    }
}
