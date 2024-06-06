import { Command } from '@sapphire/framework';
import { container } from '@sapphire/pieces';
import { reply } from '@sapphire/plugin-editable-commands';
import { Colors, EmbedBuilder, Message } from 'discord.js';
import os from 'os';

export class HealthCheckCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'healthcheck',
            aliases: ['hc'],
            description: 'Displays the health status of the bot.',
            preconditions: ['GuildOnly']
        });
    }

    public override async messageRun(message: Message) {
        const botLatency = Date.now() - message.createdTimestamp;
        const dbLatency = await this.checkDatabaseLatency();
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;

        const memoryBar = this.createMemoryBar(usedMemory, totalMemory);

        const embed = new EmbedBuilder()
            .addFields({ name: 'Bot Latency', value: `\`\`\`yaml\n${botLatency}ms\`\`\``, inline: true })
            .addFields({ name: 'Database Latency', value: `\`\`\`css\n${dbLatency}ms\`\`\``, inline: true })
            .addFields({ name: 'Total Memory', value: `\`\`\`diff\n+ ${(totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB\`\`\``, inline: true })
            .addFields({ name: 'Free Memory', value: `\`\`\`fix\n${(freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB\`\`\``, inline: true })
            .addFields({ name: 'Memory Usage', value: `\`\`\`ini\n${memoryBar}\`\`\``, inline: true })
            .addFields({ name: 'CPU Cores', value: `\`\`\`bash\n${os.cpus().length}\`\`\``, inline: true })
            .setColor(Colors.White)
            .setTimestamp();

        return await reply(message, { embeds: [embed] });
    }

    private async checkDatabaseLatency() {
        const start = Date.now();
        try {
            await container.prisma.$queryRaw`SELECT 1`;
        } catch (error) {
            this.container.logger.error('Database error:', error);
            return 'Error';
        }
        return Date.now() - start;
    }

    private createMemoryBar(usedMemory: number, totalMemory: number): string {
        const barLength = 10;
        const usedBars = Math.round((usedMemory / totalMemory) * barLength);
        const freeBars = barLength - usedBars;

        const usedBar = '█'.repeat(usedBars);
        const freeBar = '░'.repeat(freeBars);

        return `${usedBar}${freeBar} ${(usedMemory / 1024 / 1024 / 1024).toFixed(2)} GB / ${(totalMemory / 1024 / 1024 / 1024).toFixed(2)} GB`;
    }
}
