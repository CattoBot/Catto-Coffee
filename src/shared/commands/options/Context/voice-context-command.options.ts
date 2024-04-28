import { ContextMenuCommand } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";


export class VoiceContextCommandOptions {

    public static Permit: ContextMenuCommand.Options = {
        name: 'Permit',
        description: 'Permit user to join your voice channel.',
        preconditions: ['ChannelOwnerPrecondition'],
        cooldownDelay: Time.Second * 10,
    }

    public static Reject: ContextMenuCommand.Options = {
        name: 'Reject',
        description: 'Reject user from voice channel.',
        preconditions: ['ChannelOwnerPrecondition'],
        cooldownDelay: Time.Second * 10,
    }

}