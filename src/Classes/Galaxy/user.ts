import { Database } from "../../structures/Database"
import { values, invalidWords } from "./index"
import { colorHex, queryAnswerItems, queryAnswerUser, queryAnswerWorld } from "./interfaces"

export class User {
  exist: boolean | undefined = undefined
  private id: string
  private userPremiumLevel: number
  private userGuild: string
  private userLoaded: queryAnswerUser
  private objectsLoaded: queryAnswerItems[]

  constructor(userId: string) {
    this.id = userId
  }

  load(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        this.userLoaded = await Database.cattoGalaxyUsers.findUnique({
          where: { UserID: this.id }
        })
        if (!this.userLoaded) resolve(false)
        this.profile.color = `#${this.userLoaded.Color}`
        this.profile.description = this.userLoaded.Description
        this.experience.xp = this.userLoaded.Experience
        this.userPremiumLevel = this.userLoaded.PremiumLevel
        this.money.gold = this.userLoaded.Gold_Coins
        this.money.platinum = this.userLoaded.Platinum_Coins
        this.guild = this.userLoaded.Guild

        this.objectsLoaded = await Database.cattoGalaxyItems.findMany({
          where: { UserID: this.id }
        })
        if (this.objectsLoaded) {
          let objectsArray:{id:number, amount:number}[]
          this.objectsLoaded.forEach(object => {
            objectsArray.push({id: object.ItemID, amount: object.Amount})
          })
          this.items.list = objectsArray
        }
        resolve(true)
      } catch {
        reject(new Error("An unexpected error was detected"))
      }
    })
  }

  update(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!this.userLoaded) reject(new Error("Can't update an user who doesn't exists"))
      await Database.cattoGalaxyUsers.update({
        where: {
          UserID: this.id
        },
        data: {
          Color: this.profile.color,
          Description: this.profile.description,
          Experience: this.experience.xp,
          PremiumLevel: this.premium,
          Gold_Coins: this.money.gold,
          Platinum_Coins: this.money.platinum,
          Guild: this.guild
        }
      })
    })
  }

  create(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      await this.load()
      if (this.userLoaded) reject(new Error("Can't create an user if it allready exists"))
      try {
        await Database.cattoGalaxyUsers.create({
          data: {
            UserID: this.id,
            Guild: "0",
            Gold_Coins: values.defaultGoldCoins[this.premium],
            Platinum_Coins: values.defaultPlatinumCoins[this.premium]
          }
        })
        resolve(true)
      } catch {
        resolve(false)
      }
    })
  }

  reset(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!this.userLoaded) reject(new Error("Can't reset an user who doesn't exist"))
      try {
        await Database.cattoGalaxyUsers.update({
          where: {
            UserID: this.id
          },
          data: {
            TutorialSteep: 0,
            Description: undefined,
            Color: undefined,
            Experience: 0,
            Ship: 0,
            Gold_Coins: values.defaultGoldCoins[this.premium],
            Platinum_Coins: values.defaultPlatinumCoins[this.premium],
            Victories: 0,
            Defeats: 0,
            Draws: 0,
            TotalFights: 0,
            Strength: 0,
            Luck: 0,
            Intelligence: 0,
            Reputation: 0,
            HungerBoost: 0,
            HealthBoost: 0,
            SecurityBoost: 0,
            HappinessBoost: 0
          }
        })
        await Database.cattoGalaxyWorlds.deleteMany({
          where: { UserID: this.id }
        })
        resolve(true)
      } catch {
        reject(new Error("An unexpected error was detected"))
      }
    })
  }

  profile = {
    get color() {
      return this.userProfileColor
    },
    set color(hexCode: colorHex) {
      this.userProfileColor = hexCode
    },
    get description() {
      return this.userProfileDescription
    },
    set description(text) {
      this.userProfileDescription = text
    }
  }

  experience = {
    get xp() {
      return this.userXpAmount
    },
    set xp(amount: number) {
      this.userXpAmount = amount
    },
    get level() {
      let getXp = this.userXpAmount
      var level: number;
      for (level = 0; getXp > Math.floor((level ** 1.5) * 200); level++) { }
      return level
    },
    set level(level: number) {
      this.userXpAmount = Math.floor(((level ** 1.5) * 200) + 1)
    }
  }

  money = {
    get gold() {
      return this.userGoldAmount
    },
    set gold(amount: number) {
      this.userGoldAmount = amount
    },
    get platinum() {
      return this.userPlatinumAmount
    },
    set platinum(amount: number) {
      this.userPlatinumAmount = amount
    }
  }

  get guild() {
    return this.userGuild
  }
  set guild(id: string) {
    this.userGuild = id
  }

  get premium(): number {
    return this.userPremiumLevel
  }
  set premium(level: number) {
    this.userPremiumLevel = level
  }

  items = {
    get list() {
      this.objectsLoaded
      return this.objectsLoaded
    },
    set list(array:{id:number, amount:number}[]) {
      this.objectsLoaded = array
    },
    add: (id: number, amount: number): Promise<boolean> => {
      return new Promise(async (resolve, reject) => {
        if (!this.userLoaded) reject(new Error("You need to load the user to use this option"))
        if (!Number.isInteger(amount)) reject(new Error("The amount must be an integer"))
        let has = false
        this.items.list.forEach(element => {
          if (element.id == id) {
            has = true
            element.amount += amount
          }
        })
        if(!has) this.items.list.push({id: id, amount:amount})
        resolve(true)
      })
    },
    set: (id: number, amount: number): Promise<boolean> => {
      return new Promise(async (resolve, reject) => {
        if (!this.userLoaded) reject(new Error("You need to load the user to use this option"))
        if (!Number.isInteger(amount)) reject(new Error("The amount must be an integer"))
        let has = false
        this.items.list.forEach(element => {
          if (element.id == id) {
            has = true
            element.amount = amount
          }
        })
        if(!has) this.items.list.push({id: id, amount:amount})
        resolve(true)
      })
    }
  }
  
  worlds = {
    get: (): Promise<queryAnswerWorld[]> => {
      return new Promise(async (resolve, reject) => {
        if (!this.userLoaded) reject(new Error("You need to load the user to use this option"))
        // ...
      })
    },
    conquer: (id: string): Promise<boolean> => {
      return new Promise(async (resolve, reject) => {
        if (!this.userLoaded) reject(new Error("You need to load the user to use this option"))
        // ...
      })
    },
    leave: (id: string): Promise<boolean> => {
      return new Promise(async (resolve, reject) => {
        if (!this.userLoaded) reject(new Error("You need to load the user to use this option"))
        // ...
      })
    }
  }
}