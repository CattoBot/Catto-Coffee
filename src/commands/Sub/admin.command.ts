import { ApplyOptions } from '@sapphire/decorators';
import { Message, MessageResolvable } from 'discord.js';
import { Subcommand, SubcommandOptions } from '@sapphire/plugin-subcommands';
import { AdminSubCommandOptions } from '../../shared/bot/commands/options/SubCommands/manage';
import { reply } from '@sapphire/plugin-editable-commands';
import { Embed } from '../../lib/classes/Embed';
import { resolveKey } from '@sapphire/plugin-i18next';
import { CommandRegister } from '../../shared/classes/CommandRegister';

const register = new CommandRegister({
    key: 'admin',
    subcommandgroups: [
        {
            key: 'blacklist',
            subcommands: [
                { key: 'add' },
                { key: 'remove' }
            ]
        }
    ]
})

@ApplyOptions<SubcommandOptions>(AdminSubCommandOptions.Options)
export class AdminCommands extends Subcommand {
    public constructor(context: Subcommand.LoaderContext, options: Subcommand.Options) {
        super(context, {
            ...options,
        });
    }

    override registerApplicationCommands(registry: Subcommand.Registry) {
        registry.registerChatInputCommand((r) => register.build(r))
    }

    public async messageRunShow(message: Message): Promise<MessageResolvable> {
        return reply(message, { embeds: [new Embed(await resolveKey(message, `commands/replies/error:command_missmatch`))] });
    }
}