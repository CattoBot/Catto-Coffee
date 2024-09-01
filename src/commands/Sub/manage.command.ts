import { ApplyOptions } from '@sapphire/decorators';
import { CacheType, Message, MessageResolvable } from 'discord.js';
import { Subcommand, SubcommandOptions } from '@sapphire/plugin-subcommands';
import { AdminSubCommandOptions } from '../../shared/bot/commands/options/SubCommands/manage';
import { VoiceSetupModalHandler } from '../../shared/bot/modals/VoiceModals';
import { reply } from '@sapphire/plugin-editable-commands';
import { Embed } from '../../lib/classes/Embed';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Emojis } from '../../shared/enum/Emojis';
import { CommandRegister } from "../../shared/classes/CommandRegister";

const register = new CommandRegister({
    key: 'manage',
    subcommandgroups: [
        
        // `/manage xp-role ...`
        {
            key: 'xp-role',
            subcommands: [

                //  `/manage xp-role add <type> <role> <level>`
                { key: 'xprl-add', options: [
                    { key: 'xprl-type', type: 'string', required: true, choices: [
                        { key: 'vc', value: 'vc' },
                        { key: 'txt', value: 'txt' }
                    ]},
                    { key: 'xprladd-select', type: 'string', required: true, autocomplete: true },
                    { key: 'xprl-level', type: 'integer', required: true, min: 0, max: 512 }
                ]},

                //  `/manage xp-role remove <type> <role>`
                { key: 'xprl-remove', options: [
                    { key: 'xprl-type', type: 'string', required: true, choices: [
                        { key: 'vc', value: 'vc' },
                        { key: 'txt', value: 'txt' }
                    ]},
                    { key: 'xprlrm-select', type: 'string', required: true, autocomplete: true }
                ]},

                //  `/manage xp-role list <type>`
                { key: 'xprl-list', options: [
                    { key: 'xprl-type', type: 'string', required: true, choices: [
                        { key: 'vc', value: 'vc' },
                        { key: 'txt', value: 'txt' }
                    ]}
                ]}
            ]
        },

        // `/manage xp ...`
        {
            key: 'xp',
            subcommands: [
                { key: 'xp-reset', options: [
                    { key: 'xprst-user', type: "user", required: true }
                ]},
                { key: 'xp-resetall' },
                { key: 'xp-set', options: [
                    { key: 'xpst-user', type: "user", required: true },
                    { key: 'xpst-type', type: "string", required: true, choices: [
                        { key: 'points', value: 'p' },
                        { key: 'levels', value: 'l' }
                    ]},
                    { key: 'xpst-amount', type: "integer", required: true }
                ]},
                { key: 'xp-setall', options: [
                    { key: 'xpsta-type', type: "string", required: true, choices: [
                        { key: 'points', value: 'p' },
                        { key: 'levels', value: 'l' }
                    ]},
                    { key: 'xpsta-amount', type: "integer", required: true }
                ]},
                { key: 'xp-give', options: [
                    { key: 'xpgv-user', type: "user", required: true },
                    { key: 'xpgv-amount', type: "integer", required: true }
                ]},
                { key: 'xp-giveall', options: [
                    { key: 'xpgv-amount', type: "integer", required: true }
                ]}
            ]
        }
    ]
})

@ApplyOptions<SubcommandOptions>(AdminSubCommandOptions.Options)
export class AdminCommands extends Subcommand {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
        });
    }

    override registerApplicationCommands(registry: Subcommand.Registry) {
        registry.registerChatInputCommand((r) => register.build(r))
    }

    public async messageRunShow(message: Message): Promise<MessageResolvable> {
        return reply(message, { embeds: [new Embed(await resolveKey(message, `commands/replies/error:command_missmatch`))] });
    }

    public async ChatInputVoices(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<void> {
        const find = await this.container.prisma.i_voice_temp_channels.findMany({ where: { guildId: interaction.guildId! } });
        if (find.length === 1 || find.length > 1) {
            const isPremium = await this.container.prisma.premium_servers.findUnique({
                where: {
                    guildId: interaction.guild?.id
                }
            })
            if (isPremium) {
                await interaction.showModal(VoiceSetupModalHandler);
            } else {
                await interaction.reply({
                    content: `Parece que ya tienes 1 categoria existente para tus canales de voz temporales ${Emojis.ERROR}, si necesitas más, por favor considera adquirir mi versión premium.`,
                    ephemeral: true
                })
                return;
            }
        }
        await interaction.showModal(VoiceSetupModalHandler);
    }
}