import { queryAnswerWorld } from "./interfaces";
import { Database } from "../../structures/Database";

export class World {
  private id: string
  private worldLoaded: queryAnswerWorld
  private worldOwner: string
  private worldName: string

  constructor(worldId: string) {
    this.id = worldId
  }

  create(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {})
  }

}
