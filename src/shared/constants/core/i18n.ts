import type { InternationalizationContext } from "@sapphire/plugin-i18next";

export class I18nConfig {
    public static async fetchLanguage(context: InternationalizationContext) {
        if (context.interactionGuildLocale || context.interactionLocale) {
            return context.interactionGuildLocale || context.interactionLocale;
        }

        if (!context.guild) {
            return 'en-US';
        }
    }
}