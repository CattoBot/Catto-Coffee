import { ApplyOptions } from '@sapphire/decorators';
import { CacheType, InteractionResponse } from 'discord.js';

import { Subcommand, SubcommandOptions } from '@sapphire/plugin-subcommands';
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
    VoiceTransferCommand,
    VoiceTrustCommand,
    VoiceUnghostCommand,
    VoiceUnlockCommand,
    VoiceUntrustCommand
} from '@VoiceCommands';
import { VoiceCommandInteraction } from '@shared/interfaces/commands/voice.interface';
import { VoiceNameModalHandler } from '@lib/helpers/bot/interactions/modals/vc-name.modal';
import { VoiceSubCommands } from '@shared/commands/options/SubCommands/voice-command.options';
import { VoiceSubCommandsRegistration } from '@shared/commands/build/subcommands/voice';


@ApplyOptions<SubcommandOptions>(VoiceSubCommands.Options)
export class VoiceCommands extends Subcommand implements VoiceCommandInteraction {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
        });
    }

    registerApplicationCommands(registry: Subcommand.Registry) {
        VoiceSubCommandsRegistration.registerCommands(registry)
    }

    
    public async chatInputName(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<void> {
        await interaction.showModal(VoiceNameModalHandler);
    }

    public chatInputInvite(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return VoiceInviteCommand.run(interaction);
    }

    public chatInputClaim(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceClaimCommand.run(interaction);
    }

    public chatInputGhost(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceGhostCommand.run(interaction);
    }
    
    public chatInputUnghost(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceUnghostCommand.run(interaction);
    }

    public chatInputLimit(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceLimitCommand.run(interaction);
    }
    
    public chatInputLock(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceLockCommand.run(interaction);
    }

    public chatInputUnlock(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceUnlockCommand.run(interaction);
    }

    public chatInputPermit(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoicePermitCommand.run(interaction);
    }

    public chatInputReject(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceRejectCommand.run(interaction);
    }

    public chatInputTransfer(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceTransferCommand.run(interaction);
    }
    
    public chatInputBitrate(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceBitrateCommand.run(interaction);
    }
    
    public chatInputReset(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceResetCommand.run(interaction);
    }
    
    public chatInputTrust(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceTrustCommand.run(interaction);
    }
    
    public chatInputUntrust(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceUntrustCommand.run(interaction);
    }
}
