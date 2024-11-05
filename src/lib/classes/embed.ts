import { cattoProfilePhotoURL } from "../constants";
import { Colors, EmbedAuthorOptions, EmbedBuilder, EmbedFooterOptions } from "discord.js";

export default class CattoEmbed extends EmbedBuilder {
    public setDefaults(): this {
        this.setAuthor("CATTO")
        this.setTimestamp("NOW")
        this.setColor(Colors.White)
        return this
    }

    override setAuthor(options: EmbedAuthorOptions | "CATTO" | null): this {
        options == "CATTO"?super.setAuthor({ name: 'Catto', iconURL: cattoProfilePhotoURL }):super.setAuthor(options)
        return this
    }

    override setFooter(options: EmbedFooterOptions | "CATTO" | null): this {
        options == "CATTO"?super.setFooter({ text: 'Catto', iconURL: cattoProfilePhotoURL }):super.setFooter(options)
        return this
    }

    override setTimestamp(timestamp?: Date | number | "NOW" | null): this {
        timestamp == "NOW"?super.setTimestamp(new Date()):super.setTimestamp(timestamp)
        return this
    }
}