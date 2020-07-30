import {ILink, ILinkInput} from "../types/ILink";
import {BaseService} from "./BaseService";
import urljoin from "url-join";
import config from "../config";

export class LinkService extends BaseService<ILink, ILinkInput> {
  endpoint = "/links";

  buildShortenLink(linkKey: string): string {
    return urljoin(config.shortenLinkBaseURL, linkKey)
  }
}

export const linkService = new LinkService();
