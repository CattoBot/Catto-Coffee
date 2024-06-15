import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from 'discord.js';
import { applyLocalizedBuilder, createLocalizedChoice } from '@sapphire/plugin-i18next';
import { CattoCommandObject, CattoSubcommandGroupObject, CattoCommandOptionObject, CattoSubcommandObject } from '../types/Commands';

export class CommandRegister {
    private cmdObj;
    private i18routes = {
        name: ":$cmd",
        description: ":$cmd",
        subcommands: "/$type_$cmd:$key",
        subcommandgroups: "/$type_$cmd:$key",
        options: "/$type_$cmd:$key"
    }
    private geti18CmdRt(pk: { commandName: string, type: 'name' | 'description' | 'subcommandgroups' | 'subcommands' | 'options', ext?: { type: 'name' | 'description' | 'choices', key: string } }) {
        return `commands/${pk.type}${this.i18routes[pk.type]}`
            .replace("$cmd", pk.commandName)
            .replace("$type", pk.ext?.type || '')
            .replace("$key", pk.ext?.key || '')
    }

    constructor(CattoCommandObject: CattoCommandObject) {
        this.cmdObj = CattoCommandObject;
    }

    build(commandbuilder: SlashCommandBuilder) {
        let eOpts = [
            this.cmdObj.options,
            (this.cmdObj.subcommands?.filter(n => n).length||0) > 0,
            (this.cmdObj.subcommandgroups?.filter(n => n).length||0) > 0
        ]
        if ( eOpts.filter(n => !!n).length > 1 )
            throw new Error("O opciones, o grupos de subcomandos o subcomandos, pero más de uno no chico...")
        let cmdLocalName = this.geti18CmdRt({ commandName: this.cmdObj.key, type: 'name' }),
            cmdLocalDesc = this.geti18CmdRt({ commandName: this.cmdObj.key, type: 'description' })
        const localizedBuilder = applyLocalizedBuilder(commandbuilder, cmdLocalName, cmdLocalDesc);
        if (this.cmdObj.options) {
            for (const optcmdObj of this.cmdObj.options) {
                this.addOption(localizedBuilder, optcmdObj)
            }
        } else if (this.cmdObj.subcommandgroups) {
            for (const subcmdgrObj of this.cmdObj.subcommandgroups) {
                this.addSubcommandGroup(localizedBuilder, subcmdgrObj)
            }
        } else if (this.cmdObj.subcommands) {
            for (const sbcmdObj of this.cmdObj.subcommands) {
                this.addSubcommand(localizedBuilder, sbcmdObj)
            }
        } else {

        }
    }

    private addOption(builder: SlashCommandBuilder | SlashCommandSubcommandBuilder, option: CattoCommandOptionObject): void {
        let opt;
        let optLocalName = this.geti18CmdRt({ commandName: this.cmdObj.key, type: 'options', ext: { key: option.key, type: 'name' } }),
            optLocalDesc = this.geti18CmdRt({ commandName: this.cmdObj.key, type: 'options', ext: { key: option.key, type: 'description' } })
        switch (option.type) {
            case 'string':
                builder.addStringOption((build_option) => {
                    let process = applyLocalizedBuilder(build_option, optLocalName, optLocalDesc)
                        .setRequired(!!option.required).setAutocomplete(!!option.autocomplete)
                    option.choices?.forEach(choice => {
                        process.addChoices(
                            createLocalizedChoice(
                                this.geti18CmdRt({ commandName: this.cmdObj.key, type: 'options', ext: { key: choice.key, type: 'choices' } }),
                                { value: choice.value }
                            )
                        )
                    })
                    return process
                })
                break;
            case 'integer':
                builder.addIntegerOption((build_option) => {
                    let process = applyLocalizedBuilder(build_option, optLocalName, optLocalDesc)
                        .setRequired(option.required ? true : false)
                    option.min ? process.setMinValue(option.min) : null
                    option.max ? process.setMaxValue(option.max) : null
                    return process
                })
                break;
            case 'user':
                builder.addUserOption((build_option) => {
                    applyLocalizedBuilder(build_option, optLocalName, optLocalDesc)
                        .setRequired(option.required ? true : false)
                    return build_option
                })
                break;
            default:
                throw new Error(`Unknown option type: ${option.type}`);
        }
        return opt;
    }

    private addSubcommand = (builder: SlashCommandBuilder | SlashCommandSubcommandGroupBuilder, subcommand: CattoSubcommandObject) => {
        if (!this.cmdObj.subcommands?.filter(n => n)) throw new Error("Se ha intentado crear subcomandos sin subcomandos. wtf?")
        builder.addSubcommand((sbcmd) => {
            const subcommandBuilder = applyLocalizedBuilder(
                sbcmd,
                this.geti18CmdRt({commandName: this.cmdObj.key, type:'subcommands', ext:{ type: 'name', key: subcommand.key }}),
                this.geti18CmdRt({commandName: this.cmdObj.key, type:'subcommands', ext:{ type: 'description', key: subcommand.key }})
            )
            if (subcommand.options) {
                for (const option of subcommand.options) {
                    this.addOption(sbcmd, option)
                }
            }
            return subcommandBuilder
        })
    }

    private addSubcommandGroup = (builder: SlashCommandBuilder, subcommandgroup: CattoSubcommandGroupObject) => {
        if (!this.cmdObj.subcommandgroups?.filter(n => n)) throw new Error("Se  ha intentado crear grupos de subcomandos sin grupos de subcomandos. wtf?")
        builder.addSubcommandGroup((sbcmdgr) => {
            const subcommandgroupBuilder = applyLocalizedBuilder(
                sbcmdgr,
                this.geti18CmdRt({commandName: this.cmdObj.key, type: 'subcommandgroups', ext: { key: subcommandgroup.key, type: 'name' }}),
                this.geti18CmdRt({commandName: this.cmdObj.key, type: 'subcommandgroups', ext: { key: subcommandgroup.key, type: 'description' }})
            )
            for (const subcommand of subcommandgroup.subcommands) {
                this.addSubcommand(subcommandgroupBuilder, subcommand)
            }
            return sbcmdgr
        })
    }
}