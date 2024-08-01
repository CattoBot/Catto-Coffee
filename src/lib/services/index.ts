import { dbService } from "./db";
import { i18 } from "./i18";
import { TempVCService } from "./tempvc";

export class Services {
    public tempvc = TempVCService
    public i18 = i18
    public db = dbService
}