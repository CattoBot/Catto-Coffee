import { Precondition } from "@sapphire/framework";
import { CommandInteraction, GuildMember, Role } from "discord.js";
import { Emojis } from "@shared/enum/misc/emojis.enum";
import { Prisma, PrismaCoreModule } from "@lib/database/prisma";
import { resolveKey } from "@sapphire/plugin-i18next";

export class RolePermitCommandPrecondition extends Precondition {
    private prisma: PrismaCoreModule = Prisma;

    public async chatInputRun(interaction: CommandInteraction) {
        return this.run(interaction);
    }
    public async contextMenuRun(interaction: CommandInteraction) {
        return this.run(interaction);
    }

    public async getPermittedRoles(guildId: string, commandId: string) {
        const roles = await this.prisma.restrictedCommandRoles.findMany({
            where: {
                guildId: guildId,
                commandId: commandId
            }
        });
        return roles;
    }

    private getMemberRoles(member: GuildMember) {
        return new Set(member.roles.cache.map(role => role.id));
    }

    private async run(interaction: CommandInteraction) {
        const permittedRoles = await this.getPermittedRoles(interaction.guild.id, interaction.command.id);
        if (permittedRoles.length === 0) {
            return this.ok();
        }

        const memberRoles = this.getMemberRoles(interaction.member as GuildMember);
        const missingRoles = permittedRoles.filter(role => !memberRoles.has(role.roleId));

        if (missingRoles.length === 0) {
            return this.ok();
        } else {
            const missingRoleNames = missingRoles.map(role => `<@&${role.roleId}>`).join(", ");
            return this.error({
                message: await resolveKey(interaction, `preconditions/preconditions:MISSING_ROLE`, { roles: missingRoleNames, emoji: Emojis.ERROR })
            });
        }
    }
}
