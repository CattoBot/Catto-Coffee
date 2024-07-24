import { Subcommand } from '@sapphire/plugin-subcommands';
import { CommandRegister } from '../../../classes/CommandRegister';

export class ManageSubCommandsRegistration {
    public static registerCommands(registry: Subcommand.Registry): void {
        registry.registerChatInputCommand((builder) => {
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
                    },
                    {
                        key: '',
                        subcommands: [
                            { key: '' },
                            { key: '' },
                            { key: '' },
                            { key: '' },
                        ]
                    },
                ]
            })
            return register.build(builder)
        })
    }
}
