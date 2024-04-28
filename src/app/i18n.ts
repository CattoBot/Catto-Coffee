import type { InternationalizationContext } from "@sapphire/plugin-i18next";

export class I18Next {
    public static async fetch(context: InternationalizationContext) {
        if (context.interactionGuildLocale || context.interactionLocale) {
            return context.interactionGuildLocale || context.interactionLocale;
        }

        if (!context.guild) {
            return 'en-US';
        }
    }
}