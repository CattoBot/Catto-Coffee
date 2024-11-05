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

const cattoProfilePhotoURL = "https://cdn.discordapp.com/avatars/1000184915591168080/5f9381a2da87453f74d7b1d6e463fd76.webp?size=1024"

const Constants = {
    rootDir: rootDir,
    srcDir: srcDir,
    randomLoadingMessage: randomLoadingMessage,
    activities: activities,
    presenceStatus: presenceStatus,
    cattoPFPurl: cattoProfilePhotoURL
}

export default Constants

export {
    rootDir,
    srcDir,
    randomLoadingMessage,
    activities,
    presenceStatus,
    cattoProfilePhotoURL
}