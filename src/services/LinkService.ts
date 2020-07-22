import {ILink, ILinkInput} from "../types/ILink";
import {BaseService} from "./BaseService";

export class LinkService extends BaseService<ILink, ILinkInput> {
  resourceName = "links";
  endpoint = "/links";
}

export const linkService = new LinkService();