import { Listener, Events } from "@sapphire/framework";
import { EmbedBuilder, Guild, ActionRowBuilder, ButtonBuilder, ButtonStyle, Channel, TextChannel } from "discord.js";
import { Database } from "../../structures/Database";
import { Utils } from "../../util/utils"
import { CattoCoffee } from "../../App";
const { Colors, Docs, Emojis } = Utils

export class GuildCreateListener extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            once: false,
            event: Events.GuildCreate
        });
    }

    private getChannelFromCache(channelID: string): Channel | undefined { return CattoCoffee.channels.cache.get(channelID) }

    public async run(Guild: Guild) {

        const canal = this.getChannelFromCache('1128070491878465606') as TextChannel
        canal.send(`**[GUILD JOIN]** __[${CattoCoffee.guilds.cache.size}]__ \`${Guild.name}\` (\`${Guild.id}\`) ha agregado el bot. <a:pickaxe:1127394494350884974>`)
        // await channelinfo.send(``)
        await Database.guildsData.createMany({
            data: {
                GuildID: Guild.id,
            },
            skipDuplicates: true
        })

        const SystemChannel = Guild.systemChannel

        const embed = new EmbedBuilder()
        .setColor(Colors.Main)
        .setDescription(`¡Hola! Soy **${this.container.client.user?.username}** y gracias por agregarme a tu servidor. ${Emojis.General.Success} \nA continuación te explicaré resumidamente mis funcionalidades y como las puedes configurar, de todas formas, si necesitas profundizar más, puedes revisar mi documentación. <a:twings:1114741873546903563>`)
        .addFields(
            { name: `Leveling System <a:spinning:1114747500688068628>`, value: 'El bot proporciona un sistema de niveles intuitivo tanto para ¡Texto como para Voz! ambos vienen por defecto activados, si deseas desactivar alguno de los módulos, solo usa el comando `/admin disable` y selecciona el que desees.', inline: true},
            { name: `Temp Voice Channels <:voiceChannel:1092751257145462784>`, value: 'Para configurar el sistema de canales de voz temporales, puedes utilizar el comando `/admin setup voices` y se creará tanto una categoría como un canal, al unirse a ese canal, los usuarios podrán ¡personalizarlos a su gusto!', inline: true},
        )
        .setAuthor({
            name: `${this.container.client.user?.username}`,
            iconURL: `${this.container.client.user?.displayAvatarURL()}`
        })
        .setFooter({
            text: `El bot sigue en constante desarrollo, te recomendamos unirte a nuestro servidor de soporte para estar al tanto de las novedades y reportar cualquier error que encuentres.`,
        })
        .setThumbnail(`${this.container.client.user?.displayAvatarURL()}`)
        const row = new ActionRowBuilder<ButtonBuilder>({
            components: [
                new ButtonBuilder({
                    label: 'Support Server',
                    style: ButtonStyle.Link,
                    url: `${Docs.Support}`
                }),
    
                new ButtonBuilder({
                    label: 'Documentación',
                    style: ButtonStyle.Link,
                    url: `${Docs.Documentation}`
                }),
    
                new ButtonBuilder({
                    label: 'Top.gg',
                    style: ButtonStyle.Link,
                    url: `${Docs.TopGG}`
                }),
            ]
        })

        if (SystemChannel) {
            await SystemChannel.send({
                embeds: [embed],
                components: [row]
            })
        }
    }
}