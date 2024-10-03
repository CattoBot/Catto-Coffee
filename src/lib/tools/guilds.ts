import { container } from '@sapphire/framework';
import { Config } from '../../config';
import redisKeys from './redisKeys';

export default {

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
        await container.redis.set(redisKeys.guild.prefix(guildId), prefix);
    },

    /**
     * Obtiene el prefijo almacenado en Redis para un servidor.
     * En ausencia de su declaración, devuelve `null`
     * @param guildId ID del servidor en cuestión
     * @returns 
     */
    getPrefixFromRedis: (guildId: string): Promise<string | null> =>
        container.redis.get(redisKeys.guild.prefix(guildId)),

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