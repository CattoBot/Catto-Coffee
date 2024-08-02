import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import type { StoreRegistryValue } from '@sapphire/pieces';
import { blue, cyan, gray, green, magenta, magentaBright, white, yellow } from 'colorette';
import { ActivityType, PresenceData } from 'discord.js';
import { DatabaseExperienceEntriesExists } from '../lib/decorators/DatabaseEntriesExists';

const dev = process.env.NODE_ENV !== 'production';

@ApplyOptions<Listener.Options>({ once: true })
export class ReadyEvent extends Listener {
	private readonly style = dev ? yellow : blue;

	@DatabaseExperienceEntriesExists()
	public override run() {
		this.printBanner();
		this.printStoreDebugInformation();
		this.setBotPresence();
		setTimeout(() => {
			return this.container.console.start(cyan(`${this.container.client.user?.username} is online.`)) 
		}, 2000);
		
	}

	private printBanner() {
		const success = green('+');
		const llc = dev ? magentaBright : white;
		const blc = dev ? magenta : blue;
		const guildCount = this.container.client.guilds.cache.size;
		const userCount = this.container.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
		const pad = ' '.repeat(7);
		console.log(
			String.raw`
${llc('Bot Version: ')} ${pad}${blc(this.container.version)}
${llc('Guilds: ')} ${pad}[${success} ${guildCount}]
${llc('Users: ')} ${pad}[${success} ${userCount}]
${dev ? ` ${pad}${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : ''}
		`.trim()
		);
		this.container.utils.bot.bannerLoad();
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()];
		const last = stores.pop()!;
		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, true));
	}

	private styleStore(store: StoreRegistryValue, last: boolean) {
		return gray(`${last ? '└─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${store.name}.`);
	}

	private setBotPresence() {
		const guildCount = this.container.client.guilds.cache.size;
		const memberCount = this.container.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
		const presenceData: PresenceData = {
			activities: [
				{
					name: `${guildCount} Guilds | ${memberCount} Members`,
					type: ActivityType.Watching,
				}],
			status: 'idle',
		};

		this.container.client.user?.setPresence(presenceData)
	}
}
