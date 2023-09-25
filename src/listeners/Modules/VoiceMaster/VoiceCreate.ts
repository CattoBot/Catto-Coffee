import { Listener, Events } from "@sapphire/framework";
import { VoiceState, CategoryChannel, ChannelType, PermissionFlagsBits } from "discord.js";
import { Database } from "../../../structures/Database";
import { Utils } from "../../../util/utils";

let Cooldown = new Map<string, number>();

export class VoiceCreateListener extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            once: false,
            event: Events.VoiceStateUpdate,
        });
    }

    private async getChannel(GuildID: string): Promise<{ ChannelID: string, CategoryID: string }[]> {
        const Data = await Database.configTempChannels.findMany({
            where: { GuildID: GuildID }
        });

        return Data.map(result => ({
            ChannelID: result.TempVoiceChannelCreate,
            CategoryID: result.TempVoiceCategory
        }));
    }

    private async createUserPermissions(UserID: string): Promise<{ id: string, allow: bigint, deny: bigint }> {
        return {
            id: UserID,
            allow: PermissionFlagsBits.Connect | PermissionFlagsBits.ViewChannel,
            deny: BigInt(0),
        };
    }

    public async run(OldState: VoiceState, NewState: VoiceState) {
        try {
            const { guild } = NewState;
            const { id: GuildID } = guild;
            const { id: UserID } = NewState.member || {};
            if (!GuildID || !UserID) return;

            const ChannelData = await this.getChannel(GuildID);

            await Promise.all(ChannelData.map(async ({ ChannelID, CategoryID }) => {
                const CategoryChannel = guild.channels.resolve(CategoryID) as CategoryChannel;

                if (
                    (NewState.channelId === ChannelID && OldState.channelId !== ChannelID) ||
                    (NewState.channelId === ChannelID && !OldState.channelId)
                ) {
                    const UserCooldown = Cooldown.get(UserID);
                    if (UserCooldown && UserCooldown > Date.now()) {
                        return;
                    }

                    Cooldown.set(UserID, Date.now() + Utils.getCooldowns().VoiceCreate);

                    const ChannelOverwrites = CategoryChannel.permissionOverwrites.cache.map((overwrite) => ({
                        id: overwrite.id,
                        allow: overwrite.allow.bitfield,
                        deny: overwrite.deny.bitfield,
                    }));

                    ChannelOverwrites.push(await this.createUserPermissions(UserID));

                    const channel = await guild.channels.create({
                        name: `Canal de ${NewState.member?.displayName}`,
                        type: ChannelType.GuildVoice,
                        parent: CategoryChannel,
                        permissionOverwrites: ChannelOverwrites
                    });

                    await NewState.setChannel(channel).catch(() => { });


                    await Database.activeTempVoices.create({
                        data: {
                            GuildID: GuildID,
                            ChannelID: channel.id,
                            ChannelOwner: UserID,
                            ChannelCategory: channel.parentId
                        }
                    });

                }
            }));
        } catch (error) {
            // Manejar el error o registrar un mensaje de error aquí
        }
    }
}