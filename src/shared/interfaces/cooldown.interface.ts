/**
 * The options for the cooldown time.
 */
interface CooldownTimeOptions {

    /**
     * The time in seconds for the cooldown.
     */
    seconds?: number;

    /**
     * The time in minutes for the cooldown.
     */
    minutes?: number;

    /**
     * The time in hours for the cooldown.
     */
    hours?: number;

    /**
     * The time in days for the cooldown.
     */
    days?: number;

}

interface ExtendedOptions extends CooldownTimeOptions {
    /**
     * The maximum amount of times the command can be executed within the cooldown time.
     */
    executionLimit?: number;

}

export type CooldownOptions = ExtendedOptions;
