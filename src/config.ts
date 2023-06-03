import { Colors } from "discord.js"

export default {
    BotSettings: {
        Token: process.env.BOT_TOKEN,
        OwnerIDs: [''],
        DefaultVoiceExperienceSpeed: 60, // segundos
        DefaultTextExperienceCooldown: 60 // segundos
    },
    Colors: {
        main: Colors.White,
        error: Colors.Red,
        success: Colors.Green,
        warning: Colors.Yellow,
        info: Colors.Blue
    },
    emojis: {
        success: '<:accepted:1083594549575823430>',
        error: '<a:cattonope:1078929462290292756>',
        warning: '<:cattowarn:1109936311399350433>',
        info: '<a:cattobell:1114454366213115965>'
    }
}