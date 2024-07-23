import type { ChatInputCommandSuccessPayload, Command, ContextMenuCommandSuccessPayload, MessageCommandSuccessPayload } from '@sapphire/framework';
import { container } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { cyan } from 'colorette';
import { ActivityType, EmbedBuilder, type APIUser, type Guild, type Message, type User } from 'discord.js';
import { RandomLoadingMessage } from './constants';
import { join } from "path";
import { readFileSync } from "fs";
import { Status } from '../shared/enum/Status';
import { Activities, PresenceStatus } from './constants';
import { CanvasRenderingContext2D, Image, registerFont, } from 'canvas';
import { Time } from "@sapphire/time-utilities"
import { Config } from '../config';
import { TimeMeassure } from '../shared/types/timeMeassure';

export class Utils {

	/**
	 * Número del contador actual
	 */
	private x = 0

	/**
	 * Cada vez que es llamado incrementa su valor en 1
	 */
	get counter() {
		return this.x++
	}

	set counter(x) {
		this.x = x
	}

	/**
	 * Elije un elemento aleatorio del array entregado
	 * @param array Array del que se seleccionará
	 * @example
	 * let randomEntry = pickRandom([1, 2, 3, 4])
	 * console.log(randomEntry) // 3
	 */
	pickRandom<T>(array: readonly T[]): T {
		const { length } = array;
		return array[Math.floor(Math.random() * length)];
	}

	/**
	 * Hace múltiples intentos a una función asíncrona.
	 * @param asyncFn Función a probar.
	 * @param retries Número de intentos a realizar.
	 * @param delay Tiempo opcional de espera entre intentos.
	 */
	async retryAsync<T>(asyncFn: () => Promise<T>, retries: number, delay?: number): Promise<T> {
		try {
			return await asyncFn(); // Attempt to execute the function`
		} catch (error) {
			if (retries > 0) { // Check if there are retries left
				if (delay) {
					await new Promise(resolve => setTimeout(resolve, delay)); // Wait for the specified delay
				}
				return this.retryAsync(asyncFn, retries - 1, delay); // Recursively retry the function
			} else {
				throw error; // No retries left, throw the last error encountered
			}
		}
	}

	ConvertBitrateToMillions(bitrate: number) {
		return bitrate * 1000;
	}

	/**
	 *   _______ _                
	 *  |__   __(_)               
	 *     | |   _ _ __ ___   ___ 
	 *     | |  | | '_ ` _ \ / _ \
	 *     | |  | | | | | | |  __/
	 *     |_|  |_|_| |_| |_|\___|
	 * 
	 * Made by @gacarbla
	 */

	/**
	 * Grupo de utilidades y funciones referentes al tiempo y conversión de unidades
	 */
	time = {
		/**
		 * Convierte segundos a milisegundos
		 * @param num Número de segundos a convertir
		 * @returns Número de milisegndos que lo equivalen
		 */
		seconds: (num: number) => Time.Second * num,

		/**
		 * Convierte minutos a milisegundos
		 * @param num Número de minutos a convertir
		 * @returns Número de milisegundos que lo equivalen
		 */
		minutes: (num: number) => Time.Minute * num,

		/**
		 * Convierte horas a milisegundos
		 * @param num Número de horas a convertir
		 * @returns Número de milisegundos que lo equivalen
		 */
		hours: (num: number) => Time.Hour * num,

		/**
		 * Convierte días a milisegundos
		 * @param num Número de días a convertir
		 * @returns Número de milisegundos que lo equivalen
		 */
		days: (num: number) => Time.Day * num,

		/**
		 * Convierte semanas a milisegundos
		 * @param num Número de semanas a convertir
		 * @returns Número de milisegundos que lo equivalen
		 */
		weeks: (num: number) => Time.Week * num,

		/**
		 * Convierte años a milisegundos
		 * @param num Número de años a convertir
		 * @returns Número de milisegundos que lo equivalen
		 */
		years: (num: number) => Time.Year * num,

		/**
		 * Convierte milisegundos a segundos
		 * @param num Número de milisegundos a convertir
		 * @returns Número de segundos que lo equivalen
		 */
		toseconds: (num: number) => Math.floor(num / Time.Second),

		/**
		 * Convierte milisegundos a minutos
		 * @param num Número de milisegundos a convertir
		 * @returns Número de minutos que lo equivalen
		 */
		tominutes: (num: number) => Math.floor(num / Time.Minute),

		/**
		 * Convierte milisegundos a horas
		 * @param num Número de milisegundos a convertir
		 * @returns Número de horas que lo equivalen
		 */
		tohours: (num: number) => Math.floor(num / Time.Hour),

		/**
		 * Convierte milisegundos a días
		 * @param num Número de milisegundos a convertir
		 * @returns Número de días que lo equivalen
		 */
		todays: (num: number) => Math.floor(num / Time.Day),

		/**
		 * Convierte milisegundos a semanas
		 * @param num Número de milisegundos a convertir
		 * @returns Número de semanas que lo equivalen
		 */
		toweeks: (num: number) => Math.floor(num / Time.Week),

		/**
		 * Convierte milisegundos a años
		 * @param num Número de milisegundos a convertir
		 * @returns Número de años que lo equivalen
		 */
		toyears: (num: number) => Math.floor(num / Time.Year),

		/**
		 * Convierte cualquier unidad de tiempo disponible a otra
		 * @param num Cantidad de la unidad de tiempo inicial
		 * @param from Unidad inicial
		 * @param to Unidad final
		 * @returns Cantidad de la unidad final que equivalen a la inicial
		 * @example
		 * let timeInMinutes = 2
		 * let timeInSeconds = convert(timeInMinutes, 'minutes', 'seconds')
		 * 
		 * console.log(timeInSeconds) // 120
		 */
		convert(num: number, from: TimeMeassure, to: TimeMeassure): number {
			return this[`to${to}`](this[from](num))
		},

		/**
		 * Convierte cualquier unidad de tiempo a un formato más claro y legible.
		 * 
		 * ! No se recomienda utilizar unidades de medida superiores al minuto.
		 */
		format(num: number, meassure: TimeMeassure): string {
			const seconds = this.convert(num, meassure, 'seconds')
			if (seconds < 60) return `${seconds} second${seconds === 1 ? '' : 's'}`;
			const minutes = Math.floor(seconds / 60);
			if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'}`;
			const hours = Math.floor(minutes / 60);
			if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'}`;
			const days = Math.floor(hours / 24);
			return `${days} day${days === 1 ? '' : 's'}`;
		}
	}

	/**
	 *   _   _                 _                   
     *  | \ | |               | |                  
     *  |  \| |_   _ _ __ ___ | |__   ___ _ __ ___ 
	 *  | . ` | | | | '_ ` _ \| '_ \ / _ \ '__/ __|
	 *  | |\  | |_| | | | | | | |_) |  __/ |  \__ \
	 *  |_| \_|\__,_|_| |_| |_|_.__/ \___|_|  |___/
	 */

	/**
	 * 
	 */
	numbers = {
		/**
		 * Da formato a un número convirtiendo los miles en "K"
		 * y los millones en "M"
		 * @param num Número al que dar formato
		 * @example
		 * let dosmil = format(2000)
		 * let tresmillones = format(3000000)
		 * console.log(dosmil, tresmillones) // 2K, 3M
		 */
		format(num: number): string {
			if (num >= 1000000) {
				return (num / 1000000).toFixed(1) + "M";
			} else if (num >= 1000) {
				return (num / 1000).toFixed(1) + "K";
			} else {
				return num.toString();
			}
		}
	}

	/**
	 *   _____          _ _        _                  
	 *  |  __ \        | (_)      | |                 
	 *  | |__) |___  __| |_ ___   | | _____ _   _ ___ 
	 *  |  _  // _ \/ _` | / __|  | |/ / _ \ | | / __|
	 *  | | \ \  __/ (_| | \__ \  |   <  __/ |_| \__ \
	 *  |_|  \_\___|\__,_|_|___/  |_|\_\___|\__, |___/
	 *                                       __/ |    
	 *                                      |___/     
	 * 
	 * Made by @gacarbla
	 */

	/**
	 * Obtén la key de redis para determinadas acciones frecuentes
	 */
	getRedisKey = {

		/**
		 * En caso de tratarse de configuraciones o estados del servidor
		 */
		guild: {

			/**
			 * Key del prefijo de comandos del servidor
			 */
			prefix: (guildId: string) => `guild:config:${guildId}:prefix`
		}
	}

	/**
	 *   ____        _   
	 *  |  _ \      | |  
	 *  | |_) | ___ | |_ 
	 *  |  _ < / _ \| __|
	 *  | |_) | (_) | |_ 
	 *  |____/ \___/ \__|
	 * 
	 * Made by @gacarbla and @arestosora
	 */

	/**
	 * Miscellaneous bot settings and tools
	 */
	bot = {
		/**
		 * Devuelve una actividad aleatoria desde las constantes
		 * de actividades posibles.
		 */
		getRandomPresence: () => {
			const randomActivityType = this.pickRandom(Object.values(PresenceStatus)) as ActivityType;
			const randomActivity = this.pickRandom(Object.values(Activities));

			return {
				name: randomActivity,
				type: randomActivityType,
			};
		},

		/**
		 * Inicia un bucle por el cual cada `10` segundos la actividad
		 * del bot es cambiada a una aleatoria de la lista dada en el
		 * archivo de constantes.
		 */
		setPresence() {
			setInterval(() => {
				const { name, type } = this.getRandomPresence();
				container.client.user?.setPresence({
					status: Status.Busy,
					activities: [{ name, type }],
				});
			}, 10000);
		},

		/**
		 * Obtiene el string del banner del bot
		 */
		bannerLoad() {
			setTimeout(() => {
				const bannerPath = join(__dirname, '../../assets/banner.txt');
				const bannerText = readFileSync(bannerPath, 'utf8');
				container.console.watch(cyan(bannerText.replace("%version%", container.version)));
			}, 1000);
		},

		/**
		 * Envía un mensaje de carga como respuesta a un mensaje
		 * @param message Mensaje al que contestar
		 * @returns 
		 */
		sendLoadingMessage: (message: Message): Promise<typeof message> => {
			return send(message, { embeds: [new EmbedBuilder().setDescription(this.pickRandom(RandomLoadingMessage)).setColor('#FF0000')] });
		}
	}

	/**
	 *    _____ _                   _     
	 *   / ____| |                 | |    
	 *  | (___ | |__   __ _ _ __ __| |___ 
	 *   \___ \| '_ \ / _` | '__/ _` / __|
	 *   ____) | | | | (_| | | | (_| \__ \
	 *  |_____/|_| |_|\__,_|_|  \__,_|___/
	 * 
	 * Made by @gacarbla and @arestosora
	 */

	/**
	 * Herramientas para el monitoreo y gestión de los shards del bot
	 */
	shards = {

	}

	/**
	 *    _____                                          _     
	 *   / ____|                                        | |    
	 *  | |     ___  _ __ ___  _ __ ___   __ _ _ __   __| |___ 
	 *  | |    / _ \| '_ ` _ \| '_ ` _ \ / _` | '_ \ / _` / __|
	 *  | |___| (_) | | | | | | | | | | | (_| | | | | (_| \__ \
	 *   \_____\___/|_| |_| |_|_| |_| |_|\__,_|_| |_|\__,_|___/
	 * 
	 * Made by @gacarbla and @arestosora
	 */

	/**
	 * Herramientas de comandos del bot
	 */
	commands = {

	}

	/**
	 *    _____       _ _     _     
	 *   / ____|     (_) |   | |    
	 *  | |  __ _   _ _| | __| |___ 
	 *  | | |_ | | | | | |/ _` / __|
	 *  | |__| | |_| | | | (_| \__ \
	 *   \_____|\__,_|_|_|\__,_|___/
	 * 
	 * Made by @gacarbla and @arestosora
	 */

	/**
	 * Herramientas relacionadas con los servidores
	 */
	guilds = {

		/**
		 * Obtiene el prefijo del servidor. Lo intenta primero
		 * a través de redis pero en caso de no ser localizado,
		 * a través de una petición a la base de datos.
		 * @param guildId ID del servidor en cuestión
		 */
		async getPrefix(guildId: string): Promise<string> {
			let prefix = await this.getPrefixFromRedis(guildId) ?? await this.getPrefixFromDatabase(guildId) ?? Config.prefix;
			if (prefix !== Config.prefix) {
				await this.setPrefixInRedis(guildId, prefix);
			}
			return prefix;
		},

		/**
		 * Establece y/o actualiza el prefijo en redis para un
		 * determinado servidor
		 * @param guildId ID del servidor en cuestión
		 * @param prefix Prefijo a establecer
		 */
		setPrefixInRedis: async (guildId: string, prefix: string): Promise<void> => {
			await container.redis.set(this.getRedisKey.guild.prefix(guildId), prefix);
		},

		/**
		 * Obtiene el prefijo almacenado en Redis para un servidor.
		 * En ausencia de su declaración, devuelve `null`
		 * @param guildId ID del servidor en cuestión
		 * @returns 
		 */
		getPrefixFromRedis: (guildId: string): Promise<string | null> =>
			container.redis.get(this.getRedisKey.guild.prefix(guildId)),

		/**
		 * Obtiene el prefijo de servidor según la base de datos.
		 * En ausencia de su declaración, revuelve `null`
		 * @param guildId ID del servidor en cuestión
		 * @returns 
		 */
		getPrefixFromDatabase: async (guildId: string): Promise<string | null> => {
			const guild = await container.prisma.guilds.findUnique({ where: { guildId } });
			return guild?.prefix ?? null;
		}
	}

	/**
	 *    _____                          
	 *   / ____|                         
	 *  | |     __ _ _ ____   ____ _ ___ 
	 *  | |    / _` | '_ \ \ / / _` / __|
	 *  | |___| (_| | | | \ V / (_| \__ \
	 *   \_____\__,_|_| |_|\_/ \__,_|___/
	 * 
	 * Made by @gacarbla and @arestosora
	 */

	/**
	 * Herramientas y utilidades para Canvas
	 */
	canvas = {

		drawProgressBar(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, progress: number, startColor: string = '#12D6DF', endColor: string = '#F70FFF') {
			const radius = height / 2;
			const fillWidth = width * progress;
			function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
				ctx.beginPath();
				ctx.moveTo(x + radius, y);
				ctx.lineTo(x + width - radius, y);
				ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
				ctx.lineTo(x + width, y + height - radius);
				ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
				ctx.lineTo(x + radius, y + height);
				ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
				ctx.lineTo(x, y + radius);
				ctx.quadraticCurveTo(x, y, x + radius, y);
				ctx.closePath();
			}
			context.fillStyle = '#BEBEBE';
			drawRoundedRect(context, x, y, width, height, radius);
			context.fill();
			if (progress > 0) {
				const gradient = context.createLinearGradient(x, y, x + width, y);
				gradient.addColorStop(0, startColor);
				gradient.addColorStop(1, endColor);
				context.fillStyle = gradient;
				drawRoundedRect(context, x, y, fillWidth, height, radius);
				context.fill();
			}
		},

		wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, maxHeight: number, lineHeight: number) {
			const words = text.split(' ');
			let line = '';
			let testLine = '';
			let testWidth = 0;
			let lineCount = 0;
			for (let n = 0; n < words.length; n++) {
				testLine += `${words[n]} `;
				testWidth = context.measureText(testLine).width;
				if (testWidth > maxWidth && n > 0) {
					context.fillText(line, x, y);
					line = `${words[n]} `;
					y += lineHeight;
					testLine = `${words[n]} `;
					lineCount++;
					if ((lineCount + 1) * lineHeight > maxHeight) {
						context.fillText('...', x, y);
						break;
					}
				} else {
					line = testLine;
				}
			}
			if ((lineCount + 1) * lineHeight <= maxHeight) {
				context.fillText(line, x, y);
			}
		},

		drawFormattedRank(context: CanvasRenderingContext2D, rank: string, x: number, y: number) {
			context.font = '25px Poppins SemiBold';
			context.fillStyle = '#A8A8A8';
			context.textAlign = 'right';
			context.fillText(rank, x, y);
		},

		drawUserAvatar(context: CanvasRenderingContext2D, image: Image, x: number, y: number, size: number) {
			context.save();
			context.beginPath();
			context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
			context.closePath();
			context.clip();
			context.drawImage(image, x, y, size, size);
			context.restore();
		},

		drawRoundedImage(context: CanvasRenderingContext2D, image: Image, x: number, y: number, size: number) {
			context.save();
			context.beginPath();
			context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
			context.closePath();
			context.clip();
			context.drawImage(image, x, y, size, size);
			context.restore();
		},


		drawUserData(context: CanvasRenderingContext2D, username: string, level: string, xp: string, x: number, y: number) {
			context.font = '16px Poppins SemiBold';
			context.fillStyle = '#000000';
			context.textAlign = 'left';
			context.fillText(username + ' (You)', x, y + 12);
			context.fillText(`Level: ${level}`, x, y + 32);
			context.fillText(`XP: ${xp}`, x + 650, y + 10);
		},

		drawProgressBarForUser(context: CanvasRenderingContext2D, progress: number, x: number, y: number, width: number, height: number, startColor: string = '#12D6DF', endColor: string = '#F70FFF') {
			const radius = height / 2;
			const filledWidth = width * progress;
			function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
				ctx.beginPath();
				ctx.moveTo(x + radius, y);
				ctx.lineTo(x + width - radius, y);
				ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
				ctx.lineTo(x + width, y + height - radius);
				ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
				ctx.lineTo(x + radius, y + height);
				ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
				ctx.lineTo(x, y + radius);
				ctx.quadraticCurveTo(x, y, x + radius, y);
				ctx.closePath();
			}
			context.fillStyle = '#BEBEBE';
			drawRoundedRect(context, x, y, width, height, radius);
			context.fill();
			if (progress > 0) {
				const gradient = context.createLinearGradient(x, y, x + filledWidth, y);
				gradient.addColorStop(0, startColor);
				gradient.addColorStop(1, endColor);
				context.fillStyle = gradient;
				drawRoundedRect(context, x, y, filledWidth, height, radius);
				context.fill();
			}
		},

		registeringFONT() {
			(registerFont)(join(__dirname, '../../assets/fonts/Poppins-SemiBold.ttf'), { family: 'Poppins SemiBold' });
			(registerFont)(join(__dirname, '../../assets/fonts/Poppins-Bold.ttf'), { family: 'Poppins Bold' });
			(registerFont)(join(__dirname, '../../assets/fonts/Bahnschrift.ttf'), { family: 'Bahnschrift' });
		}
	}

	/**
	 *   _                                 
	 *  | |                                
	 *  | |     ___   __ _  __ _  ___ _ __ 
	 *  | |    / _ \ / _` |/ _` |/ _ \ '__|
	 *  | |___| (_) | (_| | (_| |  __/ |   
	 *  |______\___/ \__, |\__, |\___|_|   
	 *                __/ | __/ |          
	 *               |___/ |___/           
	 * 
	 * Made by @gacarbla and @arestosora
	 */

	logger = {

		logSuccessCommand(payload: ContextMenuCommandSuccessPayload | ChatInputCommandSuccessPayload | MessageCommandSuccessPayload): void {
			let successLoggerData: ReturnType<typeof this.getSuccessLoggerData>;
			if ('interaction' in payload) {
				successLoggerData = this.getSuccessLoggerData(payload.interaction.guild, payload.interaction.user, payload.command);
			} else {
				successLoggerData = this.getSuccessLoggerData(payload.message.guild, payload.message.author, payload.command);
			}
			container.logger.debug(`${successLoggerData.shard} - ${successLoggerData.commandName} ${successLoggerData.author} ${successLoggerData.sentAt}`);
		},

		getSuccessLoggerData(guild: Guild | null, user: User, command: Command) {
			const shard = this.shardsInfo(guild?.shardId ?? 0);
			const commandName = this.commandsInfo(command);
			const author = this.authorInfo(user);
			const sentAt = this.guildsInfo(guild);
			return { shard, commandName, author, sentAt };
		},

		authorInfo: (author: User | APIUser) => `${author.username}[${cyan(author.id)}]`,
		shardsInfo: (id: number) => `[${cyan(id.toString())}]`,
		commandsInfo: (command: Command) => cyan(command.name),
		guildsInfo: (guild: Guild | null) => (guild === null) ? `[${cyan('DM')}]` : `${guild.name}[${cyan(guild.id)}]`,
	}

	/**
	 * 
	 */

	/**
	 * 
	 */
	xp = {
		experienceFormula: (level: number) => Math.floor(100 * Math.pow(level, 1.5)),
		textExperienceFormula: (level: number) => 170 * level,
		globalexperienceFormula: (level: number) => Math.floor(2000 * Math.pow(level, 1.5)),
	}
}