import { SubcommandOptions } from '@sapphire/plugin-subcommands';
import { Time } from '@sapphire/time-utilities';
import { PermissionFlagsBits } from 'discord.js';
export class VoiceSubCommands {
	public static Options: SubcommandOptions = {
		name: 'voice',
		description: 'Voice channel management commands',
		requiredClientPermissions: [PermissionFlagsBits.ManageChannels],
		requiredUserPermissions: [PermissionFlagsBits.SendMessages],
		subcommands: [
			{
				name: 'showerror',
				messageRun: 'messageRunShowError',
				default: true
			},
			{
				name: 'name',
				chatInputRun: 'chatInputName',
				messageRun: 'messageRunName',
				cooldownDelay: Time.Minute * 5,
				preconditions: ['ChannelOwnerPrecondition']
			},
			{
				name: 'claim',
				chatInputRun: 'chatInputClaim',
				messageRun: 'messageRunClaim',
				preconditions: ['ChannelClaimPrecondition']
			},
			{
				name: 'ghost',
				chatInputRun: 'chatInputGhost',
				messageRun: 'messageRunGhost',
				preconditions: ['ChannelOwnerPrecondition']
			},
			{
				name: 'unghost',
				chatInputRun: 'chatInputUnghost',
				messageRun: 'messageRunUnghost',
				preconditions: ['ChannelOwnerPrecondition']
			},
			{
				name: 'limit',
				chatInputRun: 'chatInputLimit',
				messageRun: 'messageRunLimit',
				preconditions: ['ChannelOwnerPrecondition']
			},
			{
				name: 'lock',
				chatInputRun: 'chatInputLock',
				messageRun: 'messageRunLock',
				preconditions: ['ChannelOwnerPrecondition']
			},
			{
				name: 'unlock',
				chatInputRun: 'chatInputUnlock',
				messageRun: 'messageRunUnlock',
				preconditions: ['ChannelOwnerPrecondition']
			},
			{
				name: 'permit',
				chatInputRun: 'chatInputPermit',
				messageRun: 'messageRunPermit',
				preconditions: ['ChannelOwnerPrecondition']
			},
			{
				name: 'reject',
				chatInputRun: 'chatInputReject',
				messageRun: 'messageRunReject',
				preconditions: ['ChannelOwnerPrecondition']
			},
			{
				name: 'transfer',
				chatInputRun: 'chatInputTransfer',
				messageRun: 'messageRunTransfer',
				preconditions: ['ChannelOwnerPrecondition']
			},
			{
				name: 'invite',
				chatInputRun: 'chatInputInvite',
				messageRun: 'messageRunInvite',
				preconditions: ['ChannelOwnerPrecondition']
			},
			{
				name: 'bitrate',
				chatInputRun: 'chatInputBitrate',
				messageRun: 'messageRunBitrate',
				preconditions: ['ChannelOwnerPrecondition']
			},
			{
				name: 'reset',
				chatInputRun: 'chatInputReset',
				messageRun: 'messageRunReset',
				preconditions: ['ChannelOwnerPrecondition']
			},
			{
				name: 'trust',
				chatInputRun: 'chatInputTrust',
				messageRun: 'messageRunTrust',
				preconditions: ['ChannelOwnerPrecondition']
			},
			{
				name: 'untrust',
				chatInputRun: 'chatInputUntrust',
				messageRun: 'messageRunUntrust',
				preconditions: ['ChannelOwnerPrecondition']
			}
		],
		preconditions: [
			'GuildBlacklistPrecondition',
			'UserBlacklistPrecondition',
			'GuildUserBlacklistPrecondition',
			'EnabledModulePrecondition',
			'EnabledCommandPrecondition',
			'RoleCommandPermitPrecondition',
			'GuildVoiceOnlyPrecondition',
			'EditableChannelPrecondition'
		]
	};
}
