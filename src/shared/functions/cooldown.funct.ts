import { Time } from "@sapphire/time-utilities";
import { CooldownOptions } from "@shared/interfaces/utils/cooldown.interface";

export function getUserKey(guildId: string, userId: string, methodName: string): string {
    return `${guildId}:${userId}:${methodName}`;
}

export function calculateTotalCooldown(options: CooldownOptions): number {
    return (
        (options.seconds || 0) * Time.Second +
        (options.minutes || 0) * Time.Minute +
        (options.hours || 0) * Time.Hour +
        (options.days || 0) * Time.Day
    );
}

export function getRemainingTime(currentTime: number, lastExecutionTime: number, totalCooldownTime: number): number {
    return Math.ceil((lastExecutionTime + totalCooldownTime - currentTime) / 1000);
}

export function getFormattedTimeString(currentTime: number, remainingTime: number): string {
    return `<t:${Math.floor((currentTime + remainingTime * 1000) / 1000)}:R>`;
}