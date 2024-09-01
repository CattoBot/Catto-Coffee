import { container } from "@sapphire/pieces";
import { VoiceState } from "discord.js";

export function VoiceUserEntry() {
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: [VoiceState, VoiceState]) {
      try {
        const [_oldState, newState] = args;
        if (!newState.member) {
          container.logger.warn("No se encontró miembro en el estado de voz.");
          return originalMethod.apply(this, args);
        }

        const userId = newState.member.id;

        if (!userId) {
          container.logger.warn("Falta el ID de usuario en la actualización del estado de voz.");
          return originalMethod.apply(this, args);
        }

        const user = await container.prisma.users.findUnique({
          where: { userId },
        });

        if (!user) {
          await container.prisma.users.create({
            data: { userId },
          });
          container.logger.info(`Usuario con ID ${userId} creado en la base de datos.`);
        }
        return originalMethod.apply(this, args);
      } catch (error) {
        container.logger.error(`Error en VoiceUserEntry: ${error}`);
      }
    };
  };
}
