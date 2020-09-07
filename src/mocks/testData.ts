import {IPagedData} from "../types/IPage";
import {ILink} from "../types/ILink";
import {IRequestFilterOptions} from "../services/ServiceInterfaces";
import {IUser} from "../types/IUser";

/* user service */
/* const data used to mock */
export const testUser: IUser = {id: 1, username: 'string', email: "user@example.com", admin: false};
export const testAdmin: IUser = {id: 2, username: 'admin', email: 'admin@test.com', admin: true};

/* link service */
/* const data used to mock */
export const testLink: ILink = {
  id: 1,
  user: testUser,
  linkKey: "linkKey",
  href: "href",
  createAt: "createAt",
  updateAt: "updateAt",
  disabled: false
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

