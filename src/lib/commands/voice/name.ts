import { Args, container } from "@sapphire/framework";
import { resolveKey } from "@sapphire/plugin-i18next";
import { GuildMember, Message } from "discord.js";
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
        await message.member?.voice.channel?.setName(name.toString()).catch(async () => {
            await message.reply({
                content:
                    (await resolveKey(message, 'commands/replies/voice:voice_name_error', { emoji: Emojis.ERROR }))
            });
            return;
        })
        await this.updateName(name, message.member!);
        await message.reply({
            content:
                (await resolveKey(message, 'commands/replies/voice:voice_name_success', { emoji: Emojis.SUCCESS, name: name }))
        });
    }

    private static async updateName(name: string, member: GuildMember): Promise<void> {
        await container.prisma.i_users_temp_voice.upsert({
            where: {
                userId: member.id
            }, update: {
                channelName: name
            }, create: {
                userId: member.id,
                channelName: name
            }
        })
    }
}
