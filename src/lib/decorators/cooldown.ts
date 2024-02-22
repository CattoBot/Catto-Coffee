import { Subcommand } from "@sapphire/plugin-subcommands";
import { resolveKey } from "@sapphire/plugin-i18next";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { ServerLogger } from "@lib/helpers/misc/logger.helper";
import { Time } from "@sapphire/time-utilities";
import { CooldownOptions } from "@shared/interfaces/cooldown.interface";
const cooldowns: Map<string, { lastExecutionTime: number; executions: number }> = new Map();
const logger = ServerLogger.getInstance();

/**
 * Decorator used to set a cooldown for a command based on the user's ID and the guild's ID.
 * @param {CooldownOptions} options The options for the cooldown.
 * Cooldown Options:
 * - `seconds`: Time in seconds for the cooldown.
 * - `minutes`: Time in minutes for the cooldown.
 * - `hours`: Time in hours for the cooldown.
 * - `days`: Time in days for the cooldown.
 * - `executionLimit`: Maximum number of times the command can be executed within the cooldown time.
 *
 * @returns {MethodDecorator} Decorator response.
 */

export function Cooldown(options: CooldownOptions = {}): MethodDecorator {
    return function (_target: Object, _propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (interaction: Subcommand.ChatInputCommandInteraction, ...rest: any[]) {
            const userKey = getUserKey(interaction.guild.id, interaction.user.id);
            const currentTime = Date.now();
            const cooldownInterval = calculateTotalCooldown(options);
            const { lastExecutionTime, executions } = cooldowns.get(userKey) || { lastExecutionTime: 0, executions: 0 };

            if (currentTime - lastExecutionTime < cooldownInterval && executions >= (options.executionLimit || 1)) {
                const remainingCooldownTime = getRemainingTime(currentTime, lastExecutionTime, cooldownInterval);
                try {
                    return interaction.reply({
                        content: (await resolveKey(interaction, 'commands/replies/commandDenied:command_denied', { emoji: Emojis.ERROR, seconds: getFormattedTimeString(currentTime, remainingCooldownTime) })),
                        ephemeral: true,
                    });
                } catch (error) {
                    logger.error(`Error while resolving key: ${error}`);
                }
            }

            if (currentTime - lastExecutionTime >= cooldownInterval) {
                cooldowns.set(userKey, { lastExecutionTime: currentTime, executions: 1 });
            } else {
                cooldowns.set(userKey, { lastExecutionTime, executions: executions + 1 });
            }

            try {
                return await originalMethod.apply(this, [interaction, ...rest]);
            } catch (error) {
                logger.error(`Error while executing the original method: ${error}`);
            }
        };
    };
}

function getUserKey(guildId: string, userId: string): string {
    return `${guildId}:${userId}`;
}

function calculateTotalCooldown(options: CooldownOptions): number {
    return (
        (options.seconds || 0) * Time.Second +
        (options.minutes || 0) * Time.Minute +
        (options.hours || 0) * Time.Hour +
        (options.days || 0) * Time.Day
    );
}

function getRemainingTime(currentTime: number, lastExecutionTime: number, totalCooldownTime: number): number {
    return Math.ceil((lastExecutionTime + totalCooldownTime - currentTime) / 1000);
}

function getFormattedTimeString(currentTime: number, remainingTime: number): string {
    return `<t:${Math.floor((currentTime + remainingTime * 1000) / 1000)}:R>`;
}
