import { Subcommand } from '@sapphire/plugin-subcommands';
import { CommandRegister } from '../../../classes/CommandRegister';

export class VoiceSubCommandsRegistration {
    public static registerCommands(registry: Subcommand.Registry): void {
        registry.registerChatInputCommand((builder) => {
            const register = new CommandRegister({
                key: 'voice',
                subcommands: [
                    { key: 'name' },
                    { key: 'claim' },
                    { key: 'ghosted',  options: [{ type: 'string',  key: 'statusGhosted',  required: true,
                        choices: [{ key: 'n', value: 'n' }, { key: 'y', value: 'y' }]
                    }]},
                    { key: 'reset' },
                    { key: 'locked',   options: [{ type: 'string',  key: 'statusLocked',   required: true,
                        choices: [{ key: 'n', value: 'n' }, { key: 'y', value: 'y' }]
                    }]},
                    { key: 'limit',    options: [{ type: 'integer', key: 'limit',          required: true, }] },
                    { key: 'permit',   options: [{ type: 'user',    key: 'userPermit',     required: true, }] },
                    { key: 'reject',   options: [{ type: 'user',    key: 'userReject',     required: true, }] },
                    { key: 'transfer', options: [{ type: 'user',    key: 'userTransfer',   required: true, }] },
                    { key: 'invite',   options: [{ type: 'user',    key: 'userInvite',     required: true, }] },
                    { key: 'bitrate',  options: [{ type: 'integer', key: 'bitrateBitrate', required: true, }] },
                    { key: 'trust',    options: [{ type: 'user',    key: 'userTrust',      required: true, }] },
                    { key: 'untrust',  options: [{ type: 'user',    key: 'userUntrust',    required: true, }] },
                ]
            })
            return register.build(builder)
        });
    }
}