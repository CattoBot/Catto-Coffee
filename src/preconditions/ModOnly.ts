import { Precondition } from "@sapphire/framework";
import { CommandInteraction } from "discord.js";
import { Utils } from "../util/utils";
const { Emojis } = Utils

export class ModOnly extends Precondition {
    private checkMemberPermissions(interaction: CommandInteraction) {
        return interaction.memberPermissions?.has('ManageMessages');
      }

      public override async chatInputRun(interaction: CommandInteraction) {
        const hasPermissions = this.checkMemberPermissions(interaction);
    
        if (hasPermissions) {
          return this.ok();
        } else {
          return this.error({ message: "¡Solo los miembros con permisos de `Eliminar Mensajes` pueden usar este comando!" + ` ${Emojis.General.Error}`});
        }
      }
}