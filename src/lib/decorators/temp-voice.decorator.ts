import { Prisma } from "@lib/database/prisma";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { Owner } from "@shared/interfaces/utils/channel-verify.interface";
import { ChatInputCommandInteraction } from "discord.js";
const prisma = new Prisma();

/**
 * Decorator used to check channel configuration before actually editing it.
 * @param _target 
 * @param _propertyKey 
 * @param descriptor 
 * @returns MethodDecorator
 */

export function RequireChannelVerification(options: Owner = {}): MethodDecorator {
    return function (_target: Object, _propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: ChatInputCommandInteraction[]) {
            const interaction = args[0];
            const Member = interaction.guild?.members.cache.get(interaction.user.id);
            const VoiceChannel = Member?.voice.channel;

            if (!VoiceChannel) {
                return interaction.reply({
                    content: (await resolveKey(interaction, 'commands/replies/commandDenied:not_in_voice_channel', { emoji: Emojis.ERROR })),
                    ephemeral: true,
                });
            }

            const getChannel = await prisma.activeTempVoice.findUnique({
                where: {
                    id_guildId: {
                        guildId: interaction.guild?.id,
                        id: VoiceChannel.id
                    }
                },
            });

            if (!getChannel) {
                return interaction.reply({
                    content: (await resolveKey(interaction, 'commands/replies/commandDenied:voice_not_found_in_db', { emoji: Emojis.ERROR })),
                    ephemeral: true,
                });
            }

            if (options.Owner === true && interaction.user.id !== getChannel.channelOwner) {
                return interaction.reply({
                    content: (await resolveKey(interaction, 'commands/replies/commandDenied:not_voice_channel_owner', { emoji: Emojis.ERROR })),
                    ephemeral: true,
                });
            }

            return originalMethod.apply(this, args);
        };
    }
}