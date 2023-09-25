import { InteractionHandler, InteractionHandlerTypes, PieceContext } from '@sapphire/framework';
import { Utils } from '../../../util/utils';
import { ActionRowBuilder, EmbedBuilder, ButtonInteraction, ButtonBuilder, ButtonStyle, GuildMember } from "discord.js";
import { User } from '../../../Classes/Galaxy';

interface optionsObject {
    disabled?: boolean | undefined
    author: string
    label: string,
    pageNumber: number
}

export const build = async (actionRowBuilder: ActionRowBuilder, options: optionsObject) => {
    return new Promise(resolve => {
        actionRowBuilder.addComponents(
            new ButtonBuilder()
                .setCustomId(`galaxy:nxtPg_u${options.author}_${options.pageNumber}`)
                .setLabel(options.label)
                .setDisabled(options.disabled)
                .setStyle(ButtonStyle.Success)
        );
        resolve(true)
    })
};

export class ButtonHandler extends InteractionHandler {
    public constructor(ctx: PieceContext, options: InteractionHandler.Options) {
        super(ctx, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        });
    }

    public override async parse(interaction: ButtonInteraction) {
        const cat: string = interaction.customId.split(/:+/g)[0];
        const id: string = interaction.customId.split(/:+/g)[1].split(/_+/g)[0];
       if (cat == __dirname.split(/\/+/g)[__dirname.split(/\/+/g).length - 1] && id == __filename.split(/\/+/g)[__filename.split(/\/+/g).length - 1].split(/\.+/g)[0]) {
            const restriction: string = interaction.customId.split(/:+/g)[1].split(/_+/g)[1];
            let permited: boolean = restriction.startsWith("a")
            if (!permited && restriction.startsWith("u")) {
                permited = (interaction.user.id == restriction.slice(1, restriction.length))
            }
            if (permited) {
                return this.some();
            } else {
                let embed = new EmbedBuilder()
                    .setDescription(Utils.getMessages().InteractionOwner.Button)
                    .setColor("#ed4245")
                await interaction.reply({ embeds: [embed] })
                return this.none();
            }
        } else {
            return this.none();
        }
    }

    public async run(interaction: ButtonInteraction) {
        const miembro = interaction.member as GuildMember;
        const Usuario = new User(miembro.id)
        const userLoaded = await Usuario.load()

        if (!userLoaded) {
            await Usuario.create()
        } else {
            return interaction.reply({ content: "Ya estas registrado en Catto Galaxy", ephemeral: true })
        }

        return interaction.reply({ content: `Te has registrado correctamente, tus datos actuales son: `, ephemeral: true })

    }

    pages = {
        0: {
            title: "Start an incredible adventure",
            // ES: Inicia una aventura de película
            // PT: Comece uma aventura incrível
            description: "Welcome to the adventure that will take you beyond imagination!\nCatto will be your virtual companion on this exciting journey through the stars. Discover a unique and realistic economy system on Discord, set against a backdrop of planetary domination.\nUnique and never before seen features await you!\n\n**Join Catto Galaxy and live an experience without limits.**",
            // ES: ¡Bienvenid@ a la aventura que te llevará más allá de la imaginación!\nCatto será tu compañero virtual en este emocionante viaje por las estrellas. Descubre un sistema de economía realista y único en Discord, ambientado en un contexto de dominación planetaria.\n¡Funciones únicas y nunca antes vistas te esperan!\n\n**Únete a Catto Galaxy y vive una experiencia sin límites.**
            // PT: Bem-vindo à aventura que o levará além da imaginação!\nCatto será seu companheiro virtual nesta emocionante jornada pelas estrelas. Descubra um sistema de economia único e realista no Discord, tendo como pano de fundo a dominação planetária.\nRecursos únicos e nunca antes vistos esperam por você!\n\n**Inscreva-se no Catto Galaxy e tenha uma experiência ilimitada.**
            imageUrl: "https://i.ibb.co/j5yT98q/Catto-Galaxy-Begin-Image.png"
        }
    }
}