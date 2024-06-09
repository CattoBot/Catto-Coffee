import { ApplyOptions } from '@sapphire/decorators';
import { CacheType, CommandInteraction, InteractionResponse, Message } from 'discord.js';
import { Subcommand, SubcommandOptions } from '@sapphire/plugin-subcommands';
import { VoiceShowCommand, VoiceInviteCommand, VoiceClaimCommand, VoiceGhostCommand, VoiceUnghostCommand, VoiceLimitCommand, VoiceLockCommand, VoiceUnlockCommand, VoicePermitCommand, VoiceRejectCommand, VoiceTransferCommand, VoiceBitrateCommand, VoiceResetCommand, VoiceTrustCommand, VoiceUntrustCommand } from '../../lib/commands/voice';
import { VoiceSubCommandsRegistration } from '../../shared/bot/commands/build/voice';
import { VoiceSubCommands } from '../../shared/bot/commands/options/SubCommands/voice';
import { VoiceNameModal } from '../../shared/bot/modals/VoiceModals';
import { Args } from '@sapphire/framework';
import { VoiceNameCommand } from '../../lib/commands/voice/name';

@ApplyOptions<SubcommandOptions>(VoiceSubCommands.Options)
export class VoiceCommands extends Subcommand {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
        });
    }

    override registerApplicationCommands(registry: Subcommand.Registry) {
        VoiceSubCommandsRegistration.registerCommands(registry)
    }

    public async messageRunShowError(message: Message): Promise<void> {
        await VoiceShowCommand.messageRun(message);
    }

    public async messageRunName(message: Message, args: Args): Promise<void> {
        return VoiceNameCommand.messageRun(message, args);
    }

    public async messageRunClaim(message: Message): Promise<void> {
        await VoiceClaimCommand.messageRun(message);
    }

    public async messageRunBitrate(message: Message, args: Args): Promise<void> {
        return VoiceBitrateCommand.messageRun(message, args);
    }

    public async messageRunReset(message: Message): Promise<void> {
        await VoiceResetCommand.messageRun(message);
    }

    public async messageRunTrust(message: Message, args: Args): Promise<void> {
        await VoiceTrustCommand.messageRun(message, args);
    }

    public async messageRunUntrust(message: Message, args: Args): Promise<void> {
        await VoiceUntrustCommand.messageRun(message, args);
    }

    public async messageRunInvite(message: Message, args: Args): Promise<void> {
        await VoiceInviteCommand.messageRun(message, args);
    }

    public async messageRunGhost(message: Message): Promise<void> {
        await VoiceGhostCommand.messageRun(message);
    }

    public async messageRunUnghost(message: Message): Promise<void> {
        await VoiceUnghostCommand.messageRun(message);
    }

    public async messageRunLimit(message: Message, args: Args): Promise<void> {
        await VoiceLimitCommand.messageRun(message, args);
    }

    public async messageRunLock(message: Message): Promise<void> {
        await VoiceLockCommand.messageRun(message);
    }

    public async messageRunUnlock(message: Message): Promise<void> {
        await VoiceUnlockCommand.messageRun(message);
    }

    public async messageRunPermit(message: Message, args: Args): Promise<void> {
        await VoicePermitCommand.messageRun(message, args);
    }

    public async messageRunReject(message: Message, args: Args): Promise<void> {
        await VoiceRejectCommand.messageRun(message, args);
    }

    public async messageRunTransfer(message: Message, args: Args): Promise<void> {
        await VoiceTransferCommand.messageRun(message, args);
    }

    public async chatInputName(interaction: CommandInteraction): Promise<void> {
        await interaction.showModal(VoiceNameModal);
    }

    public chatInputInvite(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse> {
        return VoiceInviteCommand.chatInputRun(interaction);
    }

    public chatInputClaim(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceClaimCommand.chatInputRun(interaction);
    }

    public chatInputGhost(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceGhostCommand.chatInputRun(interaction);
    }

    public chatInputUnghost(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceUnghostCommand.chatInputRun(interaction);
    }

    public chatInputLimit(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceLimitCommand.chatInputRun(interaction);
    }

    public chatInputLock(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceLockCommand.chatInputRun(interaction);
    }

    public chatInputUnlock(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceUnlockCommand.chatInputRun(interaction);
    }

    public chatInputPermit(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoicePermitCommand.run(interaction);
    }

    public chatInputReject(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceRejectCommand.chatInputRun(interaction);
    }

    public chatInputTransfer(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceTransferCommand.chatInputRun(interaction);
    }

    public chatInputBitrate(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceBitrateCommand.chatInputRun(interaction);
    }

    public chatInputReset(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceResetCommand.chatInputRun(interaction);
    }

    public chatInputTrust(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceTrustCommand.chatInputRun(interaction);
    }

    public chatInputUntrust(interaction: Subcommand.ChatInputCommandInteraction<CacheType>): Promise<InteractionResponse<boolean>> {
        return VoiceUntrustCommand.chatInputRun(interaction);
    }
}
