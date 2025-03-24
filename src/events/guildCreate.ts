import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Guild } from 'discord.js';

@ApplyOptions<ListenerOptions>({ once: false, event: Events.GuildCreate })
export class GuildCreateListener extends Listener {
    public async run(guild: Guild): Promise<void> {
        await this.container.prisma.guild.upsert({
            where: {
                guildId: guild.id,
            },
            update: {},
            create: {
                guildId: guild.id,
                config: {
                    connectOrCreate: {
                        where: {
                            guildId: guild.id
                        },
                        create: {
                            exp: {
                                create: {
                                    isTextExperienceEnabled: false,
                                    isVoiceExperienceEnabled: true,
                                }
                            }
                        }
                    }
                }
            }
        });
    }
}
