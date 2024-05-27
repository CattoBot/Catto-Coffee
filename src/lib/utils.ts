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

/**
 * Picks a random item from an array
 * @param array The array to pick a random item from
 * @example
 * const randomEntry = pickRandom([1, 2, 3, 4]) // 1
 */
function pickRandom<T>(array: readonly T[]): T {
	const { length } = array;
	return array[Math.floor(Math.random() * length)];
}

/**
 * Sends a loading message to the current channel
 * @param message The message data for which to send the loading message
 */
function sendLoadingMessage(message: Message): Promise<typeof message> {
	return send(message, { embeds: [new EmbedBuilder().setDescription(pickRandom(RandomLoadingMessage)).setColor('#FF0000')] });
}

function logSuccessCommand(payload: ContextMenuCommandSuccessPayload | ChatInputCommandSuccessPayload | MessageCommandSuccessPayload): void {
	let successLoggerData: ReturnType<typeof getSuccessLoggerData>;

	if ('interaction' in payload) {
		successLoggerData = getSuccessLoggerData(payload.interaction.guild, payload.interaction.user, payload.command);
	} else {
		successLoggerData = getSuccessLoggerData(payload.message.guild, payload.message.author, payload.command);
	}

	container.logger.debug(`${successLoggerData.shard} - ${successLoggerData.commandName} ${successLoggerData.author} ${successLoggerData.sentAt}`);
}


function getSuccessLoggerData(guild: Guild | null, user: User, command: Command) {
	const shard = getShardInfo(guild?.shardId ?? 0);
	const commandName = getCommandInfo(command);
	const author = getAuthorInfo(user);
	const sentAt = getGuildInfo(guild);

	return { shard, commandName, author, sentAt };
}

function getShardInfo(id: number) {
	return `[${cyan(id.toString())}]`;
}

function getCommandInfo(command: Command) {
	return cyan(command.name);
}

function getAuthorInfo(author: User | APIUser) {
	return `${author.username}[${cyan(author.id)}]`;
}

function getGuildInfo(guild: Guild | null) {
	if (guild === null) return 'Direct Messages';
	return `${guild.name}[${cyan(guild.id)}]`;
}

const PREFIX_KEY = (guildId: string) => `guild:${guildId}:prefix`;

async function getPrefixFromRedis(guildId: string): Promise<string | null> {
	return container.redis.get(PREFIX_KEY(guildId));
}

async function setPrefixInRedis(guildId: string, prefix: string): Promise<void> {
	await container.redis.set(PREFIX_KEY(guildId), prefix);
}

async function fetchPrefixFromDatabase(guildId: string): Promise<string | null> {
	const guild = await container.prisma.guilds.findUnique({ where: { guildId } });
	return guild?.prefix ?? null;
}

async function getPrefix(guildId: string): Promise<string> {
	let prefix = await getPrefixFromRedis(guildId) ?? await fetchPrefixFromDatabase(guildId) ?? Config.prefix;
	if (prefix !== Config.prefix) {
		await setPrefixInRedis(guildId, prefix);
	}
	return prefix;
}


function bannerLoad() {
	setTimeout(() => {
		const bannerPath = join(__dirname, '../../assets/banner.txt');
		const bannerText = readFileSync(bannerPath, 'utf8');
		container.console.watch(cyan(bannerText));
	}, 1000);
}

function getRandomPresence(): { name: string; type: ActivityType } {
	const randomActivityType = Object.values(PresenceStatus)[Math.floor(Math.random() * Object.values(PresenceStatus).length)] as ActivityType;
	const randomActivity = Object.values(Activities)[Math.floor(Math.random() * Object.values(Activities).length)];

	return {
		name: randomActivity,
		type: randomActivityType,
	};
}

function setPresence() {
	setInterval(() => {
		const { name, type } = getRandomPresence();
		container.client.user?.setPresence({
			status: Status.Busy,
			activities: [{ name, type }],
		});
	}, 10000);
}


const experienceFormula = (level: number) => Math.floor(100 * Math.pow(level, 1.5));
export const textExperienceFormula = (level: number) => 170 * level;
export const globalexperienceFormula = (level: number) => Math.floor(2000 * Math.pow(level, 1.5));

function ConvertBitrateToMillions(bitrate: number) {
	return bitrate * 1000;
}

function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, maxHeight: number, lineHeight: number) {
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
}

function formatTime(seconds: number): string {
	if (seconds < 60) {
		return `${seconds} second${seconds === 1 ? '' : 's'}`;
	}

	const minutes = Math.floor(seconds / 60);
	if (minutes < 60) {
		return `${minutes} minute${minutes === 1 ? '' : 's'}`;
	}

	const hours = Math.floor(minutes / 60);
	if (hours < 24) {
		return `${hours} hour${hours === 1 ? '' : 's'}`;
	}

	const days = Math.floor(hours / 24);
	return `${days} day${days === 1 ? '' : 's'}`;
}

export function formatSecondsToHours(seconds: number): string {
	const hours = Math.floor(seconds / 3600);
	return `${hours}h`;
}

/**
 * Retries an asynchronous function a specified number of times.
 * @param asyncFn The asynchronous function to retry.
 * @param retries Number of times to retry before throwing the last error.
 * @param delay Optional delay between retries in milliseconds.
 * @returns A Promise with the result of `asyncFn` if it succeeds within the retries.
 */
async function retryAsync<T>(asyncFn: () => Promise<T>, retries: number, delay?: number): Promise<T> {
	try {
		return await asyncFn(); // Attempt to execute the function`
	} catch (error) {
		if (retries > 0) { // Check if there are retries left
			if (delay) {
				await new Promise(resolve => setTimeout(resolve, delay)); // Wait for the specified delay
			}
			return retryAsync(asyncFn, retries - 1, delay); // Recursively retry the function
		} else {
			throw error; // No retries left, throw the last error encountered
		}
	}
}

function formatNumber(num: number): string {
	if (num >= 1000000) {
		return (num / 1000000).toFixed(1) + "M";
	} else if (num >= 1000) {
		return (num / 1000).toFixed(1) + "K";
	} else {
		return num.toString();
	}
}
function drawRoundedImage(context: CanvasRenderingContext2D, image: Image, x: number, y: number, size: number) {
	context.save();
	context.beginPath();
	context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
	context.closePath();
	context.clip();
	context.drawImage(image, x, y, size, size);
	context.restore();
}

// function isMultipleDigits(num: number) {
// 	return num >= 10 || num <= -10;
// }

function drawUserData(context: CanvasRenderingContext2D, username: string, level: string, xp: string, x: number, y: number) {
	context.font = '16px Poppins SemiBold';
	context.fillStyle = '#000000';
	context.textAlign = 'left';
	context.fillText(username + ' (You)', x, y + 12);
	context.fillText(`Level: ${level}`, x, y + 32);
	context.fillText(`XP: ${xp}`, x + 650, y + 10);
}

// function drawProgressBar(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, progress: number, startColor: string = '#12D6DF', endColor: string = '#F70FFF') {
//     const radius = height / 2; // Adjust radius here for different curvature

//     // Function to draw rounded rectangle
//     function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
//         ctx.beginPath();
//         ctx.moveTo(x + radius, y);
//         ctx.lineTo(x + width - radius, y);
//         ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
//         ctx.lineTo(x + width, y + height - radius);
//         ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
//         ctx.lineTo(x + radius, y + height);
//         ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
//         ctx.lineTo(x, y + radius);
//         ctx.quadraticCurveTo(x, y, x + radius, y);
//         ctx.closePath();
//     }

//     // Draw empty bar
//     context.fillStyle = '#BEBEBE';
//     drawRoundedRect(context, x, y, width, height, radius);
//     context.fill();

//     // Draw filled bar
//     if (progress > 0) { // Only draw if there is progress
//         const fillWidth = width * progress;
//         const gradient = context.createLinearGradient(x, y, x + fillWidth, y);
//         gradient.addColorStop(0, startColor);
//         gradient.addColorStop(1, endColor);
//         context.fillStyle = gradient;
//         drawRoundedRect(context, x, y, fillWidth, height, radius);
//         context.fill();
//     }
// }

function drawProgressBar(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, progress: number, startColor: string = '#12D6DF', endColor: string = '#F70FFF') {
	const radius = height / 2;
	const fillWidth = width * progress;

	// Function to draw a rounded rectangle with variable width
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

	// Draw empty bar
	context.fillStyle = '#BEBEBE';
	drawRoundedRect(context, x, y, width, height, radius);
	context.fill();

	// Draw filled bar with gradient
	if (progress > 0) {
		const gradient = context.createLinearGradient(x, y, x + width, y);
		gradient.addColorStop(0, startColor);
		gradient.addColorStop(1, endColor);
		context.fillStyle = gradient;
		drawRoundedRect(context, x, y, fillWidth, height, radius);
		context.fill();
	}
}

function drawProgressBarForUser(context: CanvasRenderingContext2D, progress: number, x: number, y: number, width: number, height: number, startColor: string = '#12D6DF', endColor: string = '#F70FFF') {
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

	// Draw empty bar
	context.fillStyle = '#BEBEBE';
	drawRoundedRect(context, x, y, width, height, radius);
	context.fill();

	// Draw filled bar with gradient
	if (progress > 0) {
		const gradient = context.createLinearGradient(x, y, x + filledWidth, y);
		gradient.addColorStop(0, startColor);
		gradient.addColorStop(1, endColor);
		context.fillStyle = gradient;
		drawRoundedRect(context, x, y, filledWidth, height, radius);
		context.fill();
	}
}

function drawFormattedRank(context: CanvasRenderingContext2D, rank: string, x: number, y: number) {
	context.font = '25px Poppins SemiBold';
	context.fillStyle = '#A8A8A8';
	context.textAlign = 'right';
	context.fillText(rank, x, y);
}

function drawUserAvatar(context: CanvasRenderingContext2D, image: Image, x: number, y: number, size: number) {
	context.save();
	context.beginPath();
	context.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2, true);
	context.closePath();
	context.clip();
	context.drawImage(image, x, y, size, size);
	context.restore();
}



function registeringFONT() {
	(registerFont)(join(__dirname, '../../assets/fonts/Poppins-SemiBold.ttf'), { family: 'Poppins SemiBold' });
	(registerFont)(join(__dirname, '../../assets/fonts/Poppins-Bold.ttf'), { family: 'Poppins Bold' });
	(registerFont)(join(__dirname, '../../assets/fonts/Bahnschrift.ttf'), { family: 'Bahnschrift' });
}

function seconds(num: number) {
	return Time.Second * num
}

function minutes(num: number) {
	return Time.Minute * num
}


function hours(num: number) {
	return Time.Hour * num
}

function days(num: number) {
	return Time.Day * num
}

function weeks(num: number) {
	return Time.Week * num
}

function years(num: number) {
	return Time.Year * num
}

async function retreiveRankCardConfig(userId: string) {
	const config = await container.prisma.users_rank_card_config.findUnique({
		where: {
			userId
		}
	})
	return config;
}


export {
	seconds,
	minutes,
	hours,
	days,
	weeks,
	years,
	retryAsync,
	experienceFormula,
	sendLoadingMessage,
	logSuccessCommand,
	bannerLoad,
	setPresence,
	getRandomPresence,
	drawRoundedImage,
	drawUserData,
	drawProgressBar,
	drawProgressBarForUser,
	drawFormattedRank,
	drawUserAvatar,
	formatNumber,
	ConvertBitrateToMillions,
	registeringFONT,
	retreiveRankCardConfig,
	getPrefix,
	formatTime,
	wrapText
};