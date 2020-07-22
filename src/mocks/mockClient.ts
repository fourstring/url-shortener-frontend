import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {BaseService} from "../services/BaseService";
import {LinkService} from "../services/LinkService";
import {AuthService} from "../services/AuthService";
import {IPagedData} from "../types/IPage";
import {ILink} from "../types/ILink";
import {IRequestFilterOptions} from "../services/ServiceInterfaces";
import {IUser} from "../types/IUser";

let client = axios.create();
let mock = new MockAdapter(client);

export const baseService = new BaseService<string>(client);
export const linkService = new LinkService(client);
export const authService = new AuthService(client);

/* user service */
/* const data used to mock */
export const iUser: IUser = {id: 1, username: 'string', email: "user@example.com"};

/* link service */
/* const data used to mock */
export const iLink: ILink = {
  id: 1,
  user: iUser,
  linkKey: "string",
  href: "string",
  createAt: "string",
  updateAt: "string"
}

export const iLinkList: ILink[] = [
  iLink
]

export const iPagedData: IPagedData<ILink> = {
  count: 10,
  results: iLinkList,
}

export const iLinkInput = {
  user: 1,
  href: "string",
}

export const iRequestFilterOptions: IRequestFilterOptions<ILink> = {
  page: 1,
  size: 10,
  fields: []
};

export {mock}