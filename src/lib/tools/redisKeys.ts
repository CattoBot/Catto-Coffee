export default {
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