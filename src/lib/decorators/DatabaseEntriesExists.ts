import { container } from "@sapphire/pieces";

let isInitialized = false;

export function DatabaseExperienceEntriesExists() {
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            if (!isInitialized) {
                await initializeDatabaseEntries();
                isInitialized = true;
                container.console.success("Database initialization completed.");
            }

            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}

async function initializeDatabaseEntries() {
    container.console.watch("Initializing database entries...");
    const allGuilds = container.client.guilds.cache.map(guild => guild.id);

    for (const guildId of allGuilds) {
        const guild = await Guild(guildId);
        const voiceExperience = await VoiceExperience(guildId);
        const textExperience = await TextExperience(guildId);

        if (!guild) {
            container.console.warn(`No guild entry found for guild ID: ${guildId}, creating new entry.`);
            await container.prisma.guilds.create({
                data: { guildId }
            });
        }

        if (!voiceExperience) {
            container.console.warn(`No voice experience entry found for guild ID: ${guildId}, creating new entry.`);
            await container.prisma.i_voice_experience.create({
                data: { guildId }
            });
        }

        if (!textExperience) {
            container.console.warn(`No text experience entry found for guild ID: ${guildId}, creating new entry.`);
            await container.prisma.i_text_experience.create({
                data: { guildId }
            });
        }
    }

    container.console.success("Database entries initialization completed.");
}

async function Guild(guildId: string) {
    const guild = await container.prisma.guilds.findUnique({
        where: { guildId: guildId }
    });
    return guild;
}

async function VoiceExperience(guildId: string) {
    const voiceExperience = await container.prisma.i_voice_experience.findUnique({ where: { guildId } });
    return voiceExperience;
}

async function TextExperience(guildId: string) {
    const textExperience = await container.prisma.i_text_experience.findUnique({ where: { guildId } });
    return textExperience;
}
