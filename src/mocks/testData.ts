import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {BaseService} from "../services/BaseService";
import {LinkService} from "../services/LinkService";
import {AuthService} from "../services/AuthService";
import {IPagedData} from "../types/IPage";
import {ILink} from "../types/ILink";
import {IRequestFilterOptions} from "../services/ServiceInterfaces";
import {IUser} from "../types/IUser";

let testClient = axios.create();
let testAdapter = new MockAdapter(testClient);

export const testBaseService = new BaseService<string>(testClient);
export const testLinkService = new LinkService(testClient);
export const testAuthService = new AuthService(testClient);

/* user service */
/* const data used to mock */
export const testUser: IUser = {id: 1, username: 'string', email: "user@example.com"};

/* link service */
/* const data used to mock */
export const testLink: ILink = {
  id: 1,
  user: testUser,
  linkKey: "string",
  href: "string",
  createAt: "string",
  updateAt: "string"
};

export const testLinkList: ILink[] = [
  testLink
];

export const testPagedData: IPagedData<ILink> = {
  count: 10,
  results: testLinkList,
};

export const testLinkInput = {
  user: 1,
  href: "string",
};

export const testRequestFilterOptions: IRequestFilterOptions<ILink> = {
  page: 1,
  size: 10,
  fields: []
};

export {testClient, testAdapter}
