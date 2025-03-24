import { ApplyOptions } from '@sapphire/decorators';
import { Listener, LogLevel } from '@sapphire/framework';
import type { Logger } from '@sapphire/plugin-logger';
import { ScheduledTask, ScheduledTaskEvents } from '@sapphire/plugin-scheduled-tasks';

@ApplyOptions<Listener.Options>({ event: ScheduledTaskEvents.ScheduledTaskError })
export class UserListener extends Listener<typeof ScheduledTaskEvents.ScheduledTaskError> {
    public override async run(error: Error, task: ScheduledTask) {
        this.container.logger.error(`[Scheduled-Task Plugin]: task: ${task.name} threw an error`, error);
    }

    public override onLoad() {
        this.enabled = (this.container.logger as Logger).level <= LogLevel.Debug;
        return super.onLoad();
    }
}