import { Colors } from "discord.js"

export default {
    BotSettings: {
        Token: process.env.BOT_TOKEN,
        OwnerIDs: ['249600415040012309', '643575943289634836'],
        DefaultVoiceExperienceSpeed: 60, // segundos
        DefaultTextExperienceCooldown: 60, // segundos
        TopGGLink: process.env.TOPGG_LINK,
        SupportServerLink: process.env.SUPPORT_SERVER_LINK,
        DocumentationLink: process.env.DOCUMENTATION_LINK,
    },
    Colors: {
        main: Colors.White,
        error: Colors.Red,
        success: Colors.Green,
        warning: Colors.Yellow,
        info: Colors.Blue,
        happy: Colors.Purple
    },
    emojis: {
        success: '<:accepted:1083594549575823430>',
        error: '<a:cattonope:1078929462290292756>',
        warning: '<:cattowarn:1109936311399350433>',
        info: '<a:cattobell:1114454366213115965>',
        happy: '<a:Catto_bongos:1001431987044745266>'
    },
    messages: {
        interactionOwner: {
            button: "Sólo el dueño de este botón puede usarlo.",
            select: "Sólo el dueño de esta lista puede usarla"
        }
    }
}