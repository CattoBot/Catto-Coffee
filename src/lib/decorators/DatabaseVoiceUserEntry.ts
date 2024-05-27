import { container } from "@sapphire/pieces";
import { VoiceState } from "discord.js";

export function VoiceUserEntry() {
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: [VoiceState, VoiceState]) {
            try {
                const [_oldState, newState] = args;
                const userId = newState.member?.id;

                if (!userId) {
                    throw new Error("User ID is missing from voice state update.");
                }

                const user = await container.prisma.users.findUnique({
                    where: { userId },
                });

                if (!user) {
                    await container.prisma.users.create({
                        data: { userId },
                    });
                    container.logger.info(`User with ID ${userId} created in the database.`);
                }
                return originalMethod.apply(this, args);
            } catch (error) {
                container.logger.error(`Error in VoiceUserEntry: ${error}`);
            }
        };
    };
}
