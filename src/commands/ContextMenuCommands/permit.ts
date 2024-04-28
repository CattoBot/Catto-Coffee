
import { ApplyOptions } from '@sapphire/decorators';
import { Command, ContextMenuCommand } from '@sapphire/framework';
import { VoiceContextCommandOptions } from '@shared/commands/options/Context/voice-context-command.options';
import { ApplicationCommandType, GuildMember } from 'discord.js';
import { resolveKey } from '@sapphire/plugin-i18next';
import { Emojis } from '@shared/enum/misc/emojis.enum';
import { BuilderVoiceContextMenuCommands } from '@shared/enum/commands/context/voice';

@ApplyOptions<ContextMenuCommand.Options>(VoiceContextCommandOptions.Permit)
export class VoicePermitContextMenuCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
        });
    }

    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerContextMenuCommand((builder) => builder.setName(BuilderVoiceContextMenuCommands.Permit).setType(ApplicationCommandType.User));
    }
    

    public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
        const member = interaction.guild.members.resolve(interaction.user.id) as GuildMember;
        if (interaction.isUserContextMenuCommand() && interaction.targetMember instanceof GuildMember) {
            if (member === interaction.targetMember) {
                return await interaction.reply({
                    content: (await resolveKey(interaction, 'commands/replies/commandDenied:self_voice_command', { user: interaction.targetMember.displayName, emoji: Emojis.SUCCESS }))
                })
            }
            const user_permissions = member.voice.channel.permissionOverwrites.resolve(interaction.targetMember.id);
            await member.voice.channel.permissionOverwrites.edit(interaction.targetMember.id, {
                ...user_permissions,
                Connect: true,
                ViewChannel: true
            });

            await interaction.reply({
                content: (await resolveKey(interaction, 'commands/replies/voice:permit_success', { user: interaction.targetMember.displayName, emoji: Emojis.SUCCESS }))
            })
        }
    }
} 
