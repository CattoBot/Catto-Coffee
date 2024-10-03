import { Time } from "@sapphire/time-utilities";
import { TimeMeassure } from '../types/timeMeassure';

export default {

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