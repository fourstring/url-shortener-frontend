import {ILink} from "../types/ILink";
import {BaseService} from "./BaseService";

export class LinkService extends BaseService<ILink>{
    endpoint = "/links";
}

export const linkService = new LinkService();
