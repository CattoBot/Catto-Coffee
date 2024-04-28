interface ConfigModules {
    Experience: {
        Voice: {
            ExperienceCooldown: number;
        },
        Text: {
            ExperienceCooldown: number;
        }
    }
    Voice: {
        CreateChannelCooldown: number;
    }
}

export type Modules = ConfigModules;