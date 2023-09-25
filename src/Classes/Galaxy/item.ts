export class Item {
    private id: string
    private name: string
    private description: string
    private price: number
    private rarity: string
    private image: string

    constructor(id: string, name: string, description: string, price: number, rarity: string, image: string) {
        this.id = id
        this.name = name
        this.description = description
        this.price = price
        this.rarity = rarity
        this.image = image
    }

    get getId() {
        return this.id
    }
    get getName() {
        return this.name
    }
    get getDescription() {
        return this.description
    }
    get getPrice() {
        return this.price
    }
    get getRarity() {
        return this.rarity
    }
    get getImage() {
        return this.image
    }
}