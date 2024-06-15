import { Subcommand } from '@sapphire/plugin-subcommands';
import { CommandRegister } from '../../../classes/CommandRegister';

export class LevelingCommandsRegistry {
    public static registerCommands(registry: Subcommand.Registry): void {
        registry.registerChatInputCommand((builder) => {
            const register = new CommandRegister({
                key: 'level',
                subcommands: [
                    { key: 'rank'        },
                    { key: 'leaderboard' },
                    { key: 'rewards'     }
                ]
            })
            return register.build(builder)
        });
    }
}