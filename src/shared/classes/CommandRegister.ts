import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandSubcommandGroupBuilder } from 'discord.js';
import { applyLocalizedBuilder, createLocalizedChoice } from '@sapphire/plugin-i18next';
import { CattoCommandObject, CattoSubcommandGroupObject, CattoCommandOptionObject, CattoSubcommandObject } from '../types/Commands';
import { container } from '@sapphire/pieces';

export class CommandRegister {
    private cmdObj;

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
        let cmdLocalName = container.services.i18.getCommandRoute({ commandName: this.cmdObj.key, type: 'name' }),
            cmdLocalDesc = container.services.i18.getCommandRoute({ commandName: this.cmdObj.key, type: 'description' })
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
        let optLocalName = container.services.i18.getCommandRoute({ commandName: this.cmdObj.key, type: 'options', ext: { key: option.key, type: 'name' } }),
            optLocalDesc = container.services.i18.getCommandRoute({ commandName: this.cmdObj.key, type: 'options', ext: { key: option.key, type: 'description' } })
        switch (option.type) {
            case 'string':
                builder.addStringOption((build_option) => {
                    let process = applyLocalizedBuilder(build_option, optLocalName, optLocalDesc)
                        .setRequired(!!option.required).setAutocomplete(!!option.autocomplete)
                    option.choices?.forEach(choice => {
                        process.addChoices(
                            createLocalizedChoice(
                                container.services.i18.getCommandRoute({ commandName: this.cmdObj.key, type: 'options', ext: { key: choice.key, type: 'choices' } }),
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
        if (this.cmdObj.subcommands?.filter(n => n).length == 0) throw new Error("Se ha intentado crear subcomandos sin subcomandos. wtf?")
        builder.addSubcommand((sbcmd) => {
            const subcommandBuilder = applyLocalizedBuilder(
                sbcmd,
                container.services.i18.getCommandRoute({commandName: this.cmdObj.key, type:'subcommands', ext:{ type: 'name', key: subcommand.key }}),
                container.services.i18.getCommandRoute({commandName: this.cmdObj.key, type:'subcommands', ext:{ type: 'description', key: subcommand.key }})
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
        if (this.cmdObj.subcommandgroups?.filter(n => n).length == 0) throw new Error("Se  ha intentado crear grupos de subcomandos sin grupos de subcomandos. wtf?")
        builder.addSubcommandGroup((sbcmdgr) => {
            const subcommandgroupBuilder = applyLocalizedBuilder(
                sbcmdgr,
                container.services.i18.getCommandRoute({commandName: this.cmdObj.key, type: 'subcommandgroups', ext: { key: subcommandgroup.key, type: 'name' }}),
                container.services.i18.getCommandRoute({commandName: this.cmdObj.key, type: 'subcommandgroups', ext: { key: subcommandgroup.key, type: 'description' }})
            )
            for (const subcommand of subcommandgroup.subcommands) {
                this.addSubcommand(subcommandgroupBuilder, subcommand)
            }
            return sbcmdgr
        })
    }
}