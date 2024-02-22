import { resolveKey } from '@sapphire/plugin-i18next';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';

export class PingCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, {
            ...options,
            description: 'ping pong'
        });
    }

    public async messageRun(message: Message) {
        await message.channel.send(await resolveKey(message, 'ping:success_with_args', { latency: this.container.client.ws.ping }));
    }
}