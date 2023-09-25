export type premiumLevels = 0 | 1 | 2 | 3 | undefined
export type colorHex = `#${string}`

export interface guildFiltersOptions {
  id?: number | undefined
  owner_id?: string | undefined
  owner_username?: string | undefined
  level?: number | undefined
  xp?: number | undefined
}

export interface premiumFeatures {
  descriptionLength: {
    0: number
    1: number
    2: number
    3: number
  },
  defaultGoldCoins: {
    0: number
    1: number
    2: number
    3: number
  },
  defaultPlatinumCoins: {
    0: number
    1: number
    2: number
    3: number
  },
  levelCanChooseColor: premiumLevels
}

export interface queryAnswerUser {
  UserID: string
  TutorialSteep?: number
  PremiumLevel?: number
  PremiumUpTo?: string
  Guild: string
  Description?: string
  Color?: string
  Experience?: number
  Ship?: number
  Gold_Coins?: number
  Platinum_Coins?: number
  Victories?: number
  Defeats?: number
  Draws?: number
  TotalFights?: number
  Strength?: number
  Luck?: number
  Intelligence?: number
  Reputation?: number
  HungerBoost?: number
  HealthBoost?: number
  SecurityBoost?: number
  HappinessBoost?: number
}

export interface queryAnswerGuild {
  GuildID: string
  Experience?: number
  Gold_Coins?: number
  Platinum_Coins?: number
  InWarWith?: string
  WarPunctuation?: number
}

export interface queryAnswerItems {
  UserID: String
  ItemID: number
  Amount: number
  Wastage?: number
  StatBought?: number
  StatSold?: number
  StatUsed?: number
  StatGiven?: number
  StatReceived?: number
  StatBroken?: number
  StatRepaired?: number
}

export interface queryAnswerWorld {
  WorldID: string
  UserID: number
  Population: number
  Type: 0 | 1 | 2
  Level?: number
  Experience?: number
  Health?: number
  Hunger?: number
  Happiness?: number
  Security?: number
  Mining?: number
  Mining_level?: number
  Fishing?: number
  Fishing_level?: number
  Cooking?: number
  Cooking_Level?: number
  Trading?: number
  Trading_Level?: number
  Harvest?: number
  Harvest_Level?: number
  Crafting?: number
  Crafting_Level?: number
  Wisdom?: number
  Wisdom_Level?: number
  Army?: number
  Army_Level?: number
}