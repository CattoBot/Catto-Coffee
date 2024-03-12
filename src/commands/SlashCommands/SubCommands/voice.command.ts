import { Subcommand, SubcommandOptions } from '@sapphire/plugin-subcommands';
import { ApplyOptions, RequiresUserPermissions } from '@sapphire/decorators';
import { CacheType, InteractionResponse } from 'discord.js';
import { VoiceSubCommands } from '@shared/commands/options/SubCommands/voice-command.options';
import { VoiceCommandsRegistration } from '@shared/commands/build/subcommands/voice';
import { CommandPermissions } from '@shared/enum/commands/permissions.enum';
import { CommandCooldown } from '@lib/decorators/cmd-cooldown.decorator';
import { RequireChannelVerification } from '@lib/decorators/temp-voice.decorator';
import { VoiceNameModalHandler } from '@lib/helpers/bot/interactions/modals/vc-name.modal';
import { VoiceCommandInteraction } from '@shared/interfaces/commands/voice.interface';
import {
    VoiceBitrateCommand,
    VoiceClaimCommand,
    VoiceGhostCommand,
    VoiceInviteCommand,
    VoiceLimitCommand,
    VoiceLockCommand,
    VoicePermitCommand,
    VoiceRejectCommand,
    VoiceResetCommand,
    VoiceSetupCommand,
    VoiceTransferCommand,
    VoiceTrustCommand,
    VoiceUnghostCommand,
    VoiceUnlockCommand,
    VoiceUntrustCommand
} from '@VoiceCommands'

@ApplyOptions<SubcommandOptions>(VoiceSubCommands.Options)
export class VoiceCommands extends Subcommand implements VoiceCommandInteraction {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
        });
    }

    registerApplicationCommands(registry: Subcommand.Registry) {
        VoiceCommandsRegistration.registerCommands(registry);
    }

    @RequireChannelVerification({ Owner: true })
    @CommandCooldown({ minutes: 5 })
    public async chatInputName(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<void> {
        await interaction.showModal(VoiceNameModalHandler);
    }
    @RequiresUserPermissions(CommandPermissions.ManageGuild)
    @CommandCooldown({ seconds: 60 })
    public async chatInputSetup(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return VoiceSetupCommand.run(interaction.guild, interaction);
    }
    @CommandCooldown({ seconds: 15, executionLimit: 2 })
    @RequireChannelVerification({ Owner: true })
    public async chatInputInvite(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return VoiceInviteCommand.run(interaction);
    }
    @CommandCooldown({ seconds: 15 })
    @RequireChannelVerification({ Owner: false })
    public async chatInputClaim(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceClaimCommand.run(interaction);
    }
    @CommandCooldown({ seconds: 15 })
    @RequireChannelVerification({ Owner: true })
    public async chatInputGhost(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceGhostCommand.run(interaction);
    }
    @CommandCooldown({ seconds: 15 })
    @RequireChannelVerification({ Owner: true })
    public async chatInputUnghost(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceUnghostCommand.run(interaction);
    }
    @CommandCooldown({ seconds: 15 })
    @RequireChannelVerification({ Owner: true })
    public async chatInputLimit(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceLimitCommand.run(interaction);
    }
    @CommandCooldown({ seconds: 15 })
    @RequireChannelVerification({ Owner: true })
    public async chatInputLock(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceLockCommand.run(interaction);
    }
    @CommandCooldown({ seconds: 15 })
    @RequireChannelVerification({ Owner: true })
    public async chatInputUnlock(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceUnlockCommand.run(interaction);
    }
    @CommandCooldown({ seconds: 15 })
    @RequireChannelVerification({ Owner: true })
    public async chatInputPermit(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoicePermitCommand.run(interaction);
    }
    @CommandCooldown({ seconds: 8 })
    @RequireChannelVerification({ Owner: true })
    public async chatInputReject(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceRejectCommand.run(interaction);
    }
    @CommandCooldown({ seconds: 25 })
    @RequireChannelVerification({ Owner: true })
    public async chatInputTransfer(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceTransferCommand.run(interaction);
    }
    @CommandCooldown({ seconds: 15 })
    @RequireChannelVerification({ Owner: true })
    public async chatInputBitrate(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceBitrateCommand.run(interaction);
    }
    @CommandCooldown({ seconds: 15 })
    @RequireChannelVerification({ Owner: true })
    public async chatInputReset(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceResetCommand.run(interaction);
    }
    @CommandCooldown({ seconds: 25 })
    @RequireChannelVerification({ Owner: true })
    public async chatInputTrust(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceTrustCommand.run(interaction);
    }
    @CommandCooldown({ seconds: 25 })
    @RequireChannelVerification({ Owner: true })
    public async chatInputUntrust(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceUntrustCommand.run(interaction);
    }
}
