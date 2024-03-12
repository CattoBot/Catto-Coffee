import { Schema, model } from "mongoose";

 class UserSchema extends Schema {
    public constructor() {
        super({
            userId: String,
            commandsUsed: Number
        })
    }
}

export const User = model('User', new UserSchema());