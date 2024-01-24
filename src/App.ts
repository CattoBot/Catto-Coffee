import { CattoClient } from "./core/client.main";
import { LoadConfigHelper } from "./helpers/client/load.helper";

async function main() {
    await LoadConfigHelper.mount(new CattoClient());
}

main();
