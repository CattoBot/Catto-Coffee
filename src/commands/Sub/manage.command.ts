import { ApplyOptions, RequiresUserPermissions } from '@sapphire/decorators';
import { CacheType, InteractionResponse, Message, MessageResolvable, PermissionFlagsBits } from 'discord.js';
import { Subcommand, SubcommandOptions } from '@sapphire/plugin-subcommands';
import { AddUserToGuildBlacklistCommand } from '../../lib/commands/manage/bl-add-user';
import {
    ResetUserCommand,
    BonusVoiceRolesCommand,
    DisableCommand,
    EnableCommand,
    FilterVoiceChannelCommand,
    GuildBadgesCommand,
    IntervalLeaderboardCommand,
    LanguageCommand,
    PrefixCommand,
    RemoveUserFromGuildBlacklistCommand,
    TextExperienceCommand,
    TextRoleCommands,
    VoiceBonusChannelCommand,
    VoiceExperienceCommand,
    VoiceRoleCommands,
    ResetServerCommand
} from '../../lib/commands/manage';
import { AdminSubCommandsRegistration } from '../../shared/bot/commands/build/admin';
import { AdminSubCommandOptions } from '../../shared/bot/commands/options/SubCommands/admin-command.options';
import { VoiceSetupModalHandler } from '../../shared/bot/modals/VoiceModals';
import { Args } from '@sapphire/framework';
import { reply } from '@sapphire/plugin-editable-commands';
import { Embed } from '../../lib/classes/Embed';
import { resolveKey } from '@sapphire/plugin-i18next';

@ApplyOptions<SubcommandOptions>(AdminSubCommandOptions.Options)
export class AdminCommands extends Subcommand {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
        });
    }

    override registerApplicationCommands(registry: Subcommand.Registry) {
        AdminSubCommandsRegistration.registerCommands(registry);
    }

    public async messageRunShow(message: Message): Promise<MessageResolvable> {
        return reply(message, { embeds: [new Embed(await resolveKey(message, `commands/replies/error:command_missmatch`))] });
    }

    public async ChatInputVoices(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<void> {
        const find = await this.container.prisma.i_voice_temp_channels.findMany({ where: { guildId: interaction.guildId! } });
        if (find.length === 2 || find.length > 2) {
            await interaction.reply({ content: `You have reached the maximum amount of voice channels. If you need more, please consider getting the premium version.`, ephemeral: true })
            return;
        }
        
        await interaction.showModal(VoiceSetupModalHandler);
    }

    @RequiresUserPermissions(PermissionFlagsBits.Administrator)
    public async ChatInputAddUserToGuildBlacklist(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return AddUserToGuildBlacklistCommand.run(interaction);
    }

    @RequiresUserPermissions(PermissionFlagsBits.Administrator)
    public async ChatRemoveUserFromGuildBlacklist(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return RemoveUserFromGuildBlacklistCommand.run(interaction);
    }

    public async ChatInputAddVoiceRole(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return VoiceRoleCommands.add(interaction);
    }

    public async ChatInputRemoveVoiceRole(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return VoiceRoleCommands.remove(interaction);
    }

    public async ChatInputAddTextRole(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return TextRoleCommands.add(interaction);
    }

    public async ChatInputRemoveTextRole(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return TextRoleCommands.add(interaction);
    }

    public async ChatInputTextExperience(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return TextExperienceCommand.run(interaction);
    }

    public async ChatInputVoiceExperience(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return VoiceExperienceCommand.run(interaction);
    }

    public async ChatInputBonusChannel(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return VoiceBonusChannelCommand.run(interaction);
    }

    public async ChatInputBonusRoleAdd(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return BonusVoiceRolesCommand.add(interaction);
    }

    public async ChatInputBonusRoleRemove(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return BonusVoiceRolesCommand.remove(interaction);
    }

    public async ChatInputFilteredChannelAdd(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return FilterVoiceChannelCommand.add(interaction);
    }

    public async ChatInputFilteredChannelRemove(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return FilterVoiceChannelCommand.remove(interaction);
    }

    public async ChatInputAddDailyLeaderboard(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return IntervalLeaderboardCommand.dailyRun(interaction);
    }

    public async ChatInputAddWeeklyLeaderboard(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return IntervalLeaderboardCommand.weeklyRun(interaction);
    }

    public async ChatInputAddMonthlyLeaderboard(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return IntervalLeaderboardCommand.monthlyRun(interaction);
    }

    // public async ChatInputLogs(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
    //     return LogsCommand.run(interaction);
    // }

    // public async MessageRunLogs(interaction: Subcommand.MessageCommandInteraction): Promise<InteractionResponse> {
    //     return LogsCommand.run(interaction);
    // }

    public async ChatInputPrefix(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return PrefixCommand.chatInputRun(interaction);
    }

    public async MessageRunPrefix(message: Message, args: Args): Promise<MessageResolvable> {
        return PrefixCommand.messageRun(message, args);
    }

    public async ChatInputLanguage(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return LanguageCommand.chatInputRun(interaction);
    }

    public async MessageRunLanguage(message: Message): Promise<MessageResolvable> {
        return LanguageCommand.messageRun(message);
    }

    public async ChatInputEnableCommand(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return EnableCommand.commandRun(interaction);
    }

    // public async MessageEnableCommand(interaction: Subcommand.MessageCommandInteraction): Promise<InteractionResponse> {
    //     return EnableCommand.run(interaction);
    // }

    public async ChatInputEnableModule(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return EnableCommand.moduleRun(interaction);
    }

    // public async MessageEnableModule(interaction: Subcommand.MessageCommandInteraction): Promise<InteractionResponse> {
    //     return EnableModule.run(interaction);
    // }

    public async ChatInputDisableCommand(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return DisableCommand.commandRun(interaction);
    }

    // public async MessageDisableCommand(interaction: Subcommand.MessageCommandInteraction): Promise<InteractionResponse> {
    //     return DisableCommand.run(interaction);
    // }

    public async ChatInputDisableModule(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return DisableCommand.moduleRun(interaction);
    }

    // public async MessageDisableModule(interaction: Subcommand.MessageCommandInteraction): Promise<InteractionResponse> {
    //     return DisableModule.run(interaction);
    // }

    public async ChatInputAddBadge(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<void> {
        await GuildBadgesCommand.chatInputRun(interaction);
    }

    public async ChatInputRemoveBadge(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return GuildBadgesCommand.chatInputRemove(interaction);
    }

    public async ChatInputResetUserExperience(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<void> {
        await ResetUserCommand.chatInputRun(interaction);
    }

    public async ChatInputResetGuildExperience(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<void> {
        await ResetServerCommand.chatInputRun(interaction);
    }
}