import { container } from '@sapphire/pieces';
import { Message } from 'discord.js';

export function TextUserEntry() {
	return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			const message: Message = args[0];
			const userId = message.author.id;

			if (!userId) {
				container.logger.error('User ID is missing from message.');
			}

			const user = await container.prisma.users.findUnique({
				where: { userId }
			});

			if (!user) {
				await container.prisma.users.create({
					data: { userId }
				});

			}
			return originalMethod.apply(this, args);
		};
	};
}
