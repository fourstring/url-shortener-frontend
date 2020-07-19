import {BaseService} from "./BaseService";
import {ILink} from "../types/ILink";

export class LinkService extends BaseService<ILink> {
  resourceName = "links";
  endpoint = "/data/links";


  transformResource(resource: ILink): ILink {
    return resource;
  }
}

export const linkService = new LinkService();
