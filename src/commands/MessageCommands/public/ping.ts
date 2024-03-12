import { resolveKey } from '@sapphire/plugin-i18next';
import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<CommandOptions>({ name: 'ping', description: 'ping pong' })
export class PingCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
        });
    }

    public async messageRun(message: Message) {
        await message.channel.send(await resolveKey(message, 'commands/replies/ping:success_with_args', { latency: this.container.client.ws.ping }));
    }
}