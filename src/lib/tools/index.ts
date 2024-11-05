import time from './time'
import redisKeys from './redisKeys'
import numbers from './numbers'
import bot from './bot'
import guilds from './guilds'
import logger from './logger'

function pickRandom<T>(array: readonly T[]): T {
    const { length } = array;
    return array[Math.floor(Math.random() * length)];
}

class Counter {
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
}

export default class Utils {

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

    pickRandom = pickRandom

    bot = bot
    numbers = numbers
    redisKeys = redisKeys
    time = time
	guilds = guilds
	logger = logger
}

export { pickRandom, bot, numbers, redisKeys, time, logger, guilds, Counter }