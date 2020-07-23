import {ILink, ILinkInput} from "../types/ILink";
import {BaseService} from "./BaseService";

export class LinkService extends BaseService<ILink, ILinkInput> {
  endpoint = "/links";
}

export const linkService = new LinkService();
