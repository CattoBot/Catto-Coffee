import { Events, Listener } from "@sapphire/framework";

export class ModerationLogListener extends Listener {
    constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            event: Events.GuildMemberAdd
        });
    }

    public async run() {
        console.log("A member has joined the server.");
    }
}

