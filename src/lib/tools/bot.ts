import { container } from '@sapphire/framework';
import { pickRandom } from './index';
import { activities, presenceStatus, randomLoadingMessage } from '../constants';
import { ActivityType, EmbedBuilder, type Message } from 'discord.js';
import { cyan } from 'colorette';
import { send } from '@sapphire/plugin-editable-commands';
import { STATUS } from '../enum';
import { join } from "path";
import { readFileSync } from "fs";

export default {

    /**
     * Devuelve una actividad aleatoria desde las constantes
     * de actividades posibles.
     */
    getRandomPresence: () => {
        const randomActivityType = pickRandom(Object.values(presenceStatus)) as ActivityType;
        const randomActivity = pickRandom(Object.values(activities));

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
                status: STATUS.Busy,
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
        return send(message, { embeds: [new EmbedBuilder().setDescription(pickRandom(randomLoadingMessage)).setColor('#FF0000')] });
    }

}