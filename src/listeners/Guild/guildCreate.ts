import { Listener, Events } from "@sapphire/framework";
import  { EmbedBuilder, Guild, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import config from "../../config";
import { Prisma } from "../../client/PrismaClient";

export class GuildCreateListener extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            once: false,
            event: Events.GuildCreate
        });
    }

    public async run(Guild: Guild) {

        this.container.logger.info(`[GUILD JOIN] ${Guild.name} (${Guild.id}) added the bot.`);

        await Prisma.guildsData.create({
            data: {
                GuildID: Guild.id,
            }
        })

        const channel = Guild.systemChannel;
        
        const embed = new EmbedBuilder()
        .setColor(config.Colors.main)
        .setDescription(`¡Hola! Soy **${this.container.client.user?.username}** y gracias por agregarme a tu servidor. ${config.emojis.happy} \nA continuación te explicaré resumidamente mis funcionalidades y como las puedes configurar, de todas formas, si necesitas profundizar más, puedes revisar mi documentación. <a:twings:1114741873546903563>`)
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
                    url: `${config.BotSettings.SupportServerLink}`
                }),
    
                new ButtonBuilder({
                    label: 'Documentación',
                    style: ButtonStyle.Link,
                    url: `${config.BotSettings.DocumentationLink}`
                }),
    
                new ButtonBuilder({
                    label: 'Top.gg',
                    style: ButtonStyle.Link,
                    url: `${config.BotSettings.TopGGLink}`
                }),
            ]
        })

        if(channel){
            channel.send({
                components: [row],
                embeds: [embed]
            })
        }
  
    }
}