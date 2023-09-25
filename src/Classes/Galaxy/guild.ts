import { Database } from "../../structures/Database"
import { queryAnswerGuild } from "./interfaces"

export class Guild {
  id: string
  owner = {
    get: (): Promise<string> => {
      return new Promise(async (resolve, reject) => {

      })
    }
  }
  constructor(guildId: string) {
    this.id = guildId
  }
  get(): Promise<queryAnswerGuild> {
    return new Promise(async (resolve, reject) => {
      let loaded = await Database.cattoGalaxyGuilds.findUnique({
        where: {
          GuildID: this.id
        }
      })
      if (!loaded) {
        reject(new Error("Was imposible to get the DB data"))
      }
      resolve(loaded)
    })
  }
  xp = {
    level: {
      get: (): Promise<number> => {
        return new Promise(async (resolve, reject) => {
          try {
            let getXp = await this.xp.get()
            var level: number;
            for (level = 0; level < Math.floor((level ** 1.5) * 200); level++) { }
            resolve(level)
          } catch {
            reject(new Error("An unexpected error was detected"))
          }
        })
      },
      set: (level: number): Promise<boolean> => {
        return new Promise(async (resolve, reject) => {
          if (level < 0) reject(new Error("Level cannot be less than 0."))
          // ...
        })
      }
    },
    get: (): Promise<number> => {
      return new Promise(async (resolve, reject) => {
        let loaded = await this.get()
        resolve(loaded.Experience)
      })
    },
    set: (amount: number): Promise<boolean> => {
      return new Promise(async (resolve, reject) => {
        if (amount < 0) reject(new Error("Level cannot be less than 0."))
        // ...
      })
    },
    add: (amount: number): Promise<boolean> => {
      return new Promise(async (resolve, reject) => {
        if (amount <= 0) reject(new Error("The amount cannot be less than or equal to 0."))
        // ...
      })
    },
    subtract: (amount: number): Promise<boolean> => {
      return new Promise(async (resolve, reject) => {
        if (amount <= 0) reject(new Error("The amount cannot be less than or equal to 0."))
        // ...
      })
    }
  }
  money = {
    set: (type: "gold" | "platinum", amount: number): Promise<boolean> => {
      return new Promise(async (resolve, reject) => {
        // ...
      })
    },
    add: (type: "gold" | "platinum", amount: number): Promise<boolean> => {
      return new Promise(async (resolve, reject) => {
        if (amount <= 0) reject(new Error("The amount cannot be less than or equal to 0."))
        // ...
      })
    },
    subtract: (type: "gold" | "platinum", amount: number): Promise<boolean> => {
      return new Promise(async (resolve, reject) => {
        if (amount <= 0) reject(new Error("The amount cannot be less than or equal to 0."))
        // ...
      })
    },
    get: (type: "gold" | "platinum"): Promise<boolean> => {
      return new Promise(async (resolve, reject) => {
        // ...
      })
    }
  }
  battle = {
    attack: (guildId: string): Promise<boolean> => {
      return new Promise(async (resolve, reject) => {
        // ...
      })
    },
    surrender: (): Promise<boolean> => {
      return new Promise(async (resolve, reject) => {
        // ...
      })
    }
  }
}