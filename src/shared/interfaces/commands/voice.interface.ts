import { InteractionHandler } from "@sapphire/framework";
import { Subcommand } from "@sapphire/plugin-subcommands";
import { CommandInteraction, InteractionResponse } from "discord.js";

export interface VoiceCommandInteraction {
    /**
     * Change the voice channel name
     * @param interaction 
     */
    chatInputName(interaction: CommandInteraction): void;
    /**
     * Claim a voice channel
     * @param interaction 
     */
    chatInputClaim(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse<boolean>>;
    /**
     * Ghost a voice channel
     * @param interaction 
     */
    chatInputGhost(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse<boolean>>;
    /**
     * Unghost a voice channel
     * @param interaction 
     */
    chatInputUnghost(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse<boolean>>;
    /**
     * Limit a voice channel
     * @param interaction 
     */
    chatInputLimit(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse<boolean>>;
    /**
     * Lock a voice channel
     * @param interaction 
     */
    chatInputLock(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse<boolean>>;
    /**
     * Unlock a voice channel
     * @param interaction 
     */
    chatInputUnlock(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse<boolean>>;
    /**
     * Permit a user to join the voice channel
     * @param interaction 
     */
    chatInputPermit(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse<boolean>>;
    /**
     * Reject a user from the voice channel
     * @param interaction 
     */
    chatInputReject(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse<boolean>>;
    /**
     * Transfer the voice channel ownership
     * @param interaction 
     */
    chatInputTransfer(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse<boolean>>;
    /**
     * Invite a user to the voice channel
     * @param interaction 
     */
    chatInputInvite(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse<boolean>>;
    /**
     * Change the voice channel bitrate
     * @param interaction 
     */
    chatInputBitrate(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse<boolean>>;
    /**
     * Reset the voice channel permissions
     * @param interaction 
     */
    chatInputReset(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse<boolean>>;
    /**
     * Trust a user to manage the voice channel
     * @param interaction 
     */
    chatInputTrust(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse<boolean>>;

    /**
     * Untrust a user to manage the voice channel
     * @param interaction 
     */

    chatInputUntrust(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse<boolean>>;

    /**
     * Setup the voice channel
     * @param interaction 
     */
    chatInputSetup(interaction: Subcommand.ChatInputCommandInteraction): Promise<InteractionResponse<boolean>>;
}