import { Mongoose, ConnectOptions } from "mongoose";

export class Mongo extends Mongoose {
    constructor() {
        super();
    }

    public async fetch(uri: string, options?: ConnectOptions) {
        await super.connect(uri, options);
    }

    public async close() {
        await super.connection.close();
    }
}