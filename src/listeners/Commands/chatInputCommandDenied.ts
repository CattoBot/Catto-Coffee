import { Events, Listener, type ChatInputCommandDeniedPayload, type UserError } from '@sapphire/framework';

export class UserEvent extends Listener<typeof Events.ChatInputCommandDenied> {
  public async run({ context, message: content }: UserError, { interaction }: ChatInputCommandDeniedPayload) {
    
    // Si el error está silenciado, no contesta
    if (Reflect.get(Object(context), 'silent')) return;

    // Si el cooldown está presente (Es por cooldown), enviamos su correspondiente mensaje
    if (Reflect.get(Object(context), 'remaining')) {
      return interaction.reply({
        content: `¡Más lento! >:v\nDebes esperar ${Math.floor(Reflect.get(Object(context), 'remaining')/1000)} segundo${Math.floor(Reflect.get(Object(context), 'remaining')/1000)>1?"s":""} antes de poder volver a usar un comando.`,
        allowedMentions: { users: [interaction.user.id], roles: [] },
        ephemeral: true
      });
    }

    // Si es otra clase de error que ya fue respondida, editamos la respuesta al error de Sapphire
    if (interaction.deferred || interaction.replied) {
      return interaction.editReply({
        content,
        embeds: [],
        components: [],
        allowedMentions: { users: [interaction.user.id], roles: [] }
      });
    }

    // Si es otra clase de error pero no fue respondida aún, enviamos el mensaje de error de Sapphire
    return interaction.reply({
      content,
      embeds: [],
      components: [],
      allowedMentions: { users: [interaction.user.id], roles: [] },
      ephemeral: true
    });
  }
}