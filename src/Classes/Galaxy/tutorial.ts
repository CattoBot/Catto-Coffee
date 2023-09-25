/* <!> ------------------ NO BORRAR NADA ------------------ <!> */
import { premiumFeatures } from "./interfaces"
import { User } from "./user"
import { Guild } from "./guild"
import { World } from "./world"
import { Item } from "./item"
import { regexRules, invalidWords } from "./functions"
/* <!> ---------------------------------------------------- <!> */


// Exportación de los valores
export const values: premiumFeatures = {
  descriptionLength: { 0: 100, 1: 100, 2: 100, 3: 100 },
  defaultGoldCoins: { 0: 50, 1: 50, 2: 50, 3: 50 },
  defaultPlatinumCoins: { 0: 5, 1: 5, 2: 5, 3: 5 },
  levelCanChooseColor: 0
}


// Export clases y funciones de economía
export { User, Guild, World, Item }
export const galaxy = { User, Guild, World, Item }


// Import y export funciones y objetos de contenido inapropiado en textos
export { regexRules, invalidWords }