import { Config } from "../../../config/core.config"

export class Properties {
    public static Token: string = Config.Token
    public static Owners = Config.Owners
    public static Prefix = Config.DefaultPrefix
    public static readonly Shards = Config.Shards
}