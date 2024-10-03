import { ActivityType } from 'discord.js';
import { join } from 'path';

const rootDir = join(__dirname, '..', '..', '..');
const srcDir = join(rootDir, 'src');
const randomLoadingMessage = ['Computing...', 'Thinking...', 'Cooking some food', 'Give me a moment', 'Loading...'];
const activities = ['catto.gatitosworld.com', 'catto.docs.com', 'Made with 💕'];

const presenceStatus = {
    Playing: ActivityType.Playing,
    Streaming: ActivityType.Streaming,
    Listening: ActivityType.Listening,
    Watching: ActivityType.Watching
};

const Constants = {
    rootDir: rootDir,
    srcDir: srcDir,
    randomLoadingMessage: randomLoadingMessage,
    activities: activities,
    presenceStatus: presenceStatus
}

export default Constants

export {
    rootDir,
    srcDir,
    randomLoadingMessage,
    activities,
    presenceStatus
}