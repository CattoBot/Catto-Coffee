import { Item } from "../item";
import { User } from "..";

export class Food extends Item {

    public health: number;
    public hunger: number;
    public thirst: number;
    public energy: number;
    public hasBuff: boolean;
    public buff: string;

    constructor(id: string, name: string, description: string, price: number, rarity: string, image: string, health: number, hunger: number, thirst: number, energy: number, hasBuff: boolean, buff: string) {
        super(id, name, description, price, rarity, image);
        this.health = health;
        this.hunger = hunger;
        this.thirst = thirst;
        this.energy = energy;
        this.hasBuff = hasBuff;
        this.buff = buff;
    }

    public ApplyBuff(user: User) {

    }
}