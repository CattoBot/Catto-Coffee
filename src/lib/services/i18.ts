export class i18 {
    static i18CMDroutes = {
        name: ":$cmd",
        description: ":$cmd",
        subcommands: "/$type_$cmd:$key",
        subcommandgroups: "/$type_$cmd:$key",
        options: "/$type_$cmd:$key"
    }
    static getCommandRoute(pk: { commandName: string, type: 'name' | 'description' | 'subcommandgroups' | 'subcommands' | 'options', ext?: { type: 'name' | 'description' | 'choices', key: string } }) {
        return `commands/${pk.type}${this.i18CMDroutes[pk.type]}`
            .replace("$cmd", pk.commandName)
            .replace("$type", pk.ext?.type || '')
            .replace("$key", pk.ext?.key || '')
    }
}