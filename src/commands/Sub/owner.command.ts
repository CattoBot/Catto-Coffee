import { ApplyOptions } from '@sapphire/decorators';
import { Message, MessageResolvable } from 'discord.js';
import { Subcommand, SubcommandOptions } from '@sapphire/plugin-subcommands';
import { OwnerSubCommandOptions } from '../../shared/bot/commands/options/SubCommands/owner';
import { reply } from '@sapphire/plugin-editable-commands';
import { Embed } from '../../lib/classes/Embed';
import { resolveKey } from '@sapphire/plugin-i18next';
import { CommandRegister } from '../../shared/classes/CommandRegister';

const register = new CommandRegister({
    key: 'owner',
    subcommandgroups: [
        {
            key: 'sanction',
            subcommands: [
                { key: 'sanc-add', options: [
                    { key: 'sanc-addid', required: true, type: 'string' },
                    { key: 'sanc-addtype', required: true, type: 'string', choices: [
                        { key: 'sanc-ban', value: 'b' },
                        { key: 'sanc-warn', value: 'w' }
                    ] }
                ] },
                { key: 'sanc-remove', options: [
                    { key: 'sanc-remid', required: true, type: 'integer', min: 0 }
                ] },
                { key: 'sanc-list', options: [
                    { key: 'sanc-listid', required: false, type: 'string' },
                    { key: 'sanc-listamount', required: false, type: 'integer', min: 3, max: 10 }
                ] }
            ]
        },
        {
            key: 'badges',
            subcommands: [
                { key: 'bdg-add', options: [
                    { key: 'bdg-addid', required: true, type: 'string' },
                    { key: 'bdg-addimg', required: true, type: 'attachment' }
                ] },
                { key: 'bdg-remove', options: [
                    { key: 'bdg-rmid', required: true, type: 'string' }
                ] },
                { key: 'bdg-search', options: [
                    { key: 'bdg-searchparam', required: true, type: 'string', autocomplete: true }
                ] }
            ]
        }
    ]
})

@ApplyOptions<SubcommandOptions>(OwnerSubCommandOptions.Options)
export class OwnerCommands extends Subcommand {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
        });
    }

    override registerApplicationCommands(registry: Subcommand.Registry) {
        registry.registerChatInputCommand((r) => register.build(r), { idHints: [''], guildIds: ['998352785202479134'] })
    }

    public async messageRunShow(message: Message): Promise<MessageResolvable> {
        return reply(message, { embeds: [new Embed(await resolveKey(message, `commands/replies/error:command_missmatch`))] });
    }

    public async ChatInputOwnerSanctionAdd() {

    }

    public async ChatInputOwnerSanctionRemove() {

    }

    public async ChatInputOwnerBadgesAdd() {

    }

    public async ChatInputOwnerBadgesRemove() {

    }

    
}