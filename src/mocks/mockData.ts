import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {ILink} from "../types/ILink";
import {IUser} from "../types/IUser";

let mockClient = axios.create();

let Adapter = new MockAdapter(mockClient, {delayResponse: 1000});

export const testUser: IUser = {id: 1, username: 'string', email: "user@example.com"};

export const testLink: ILink = {
  id: 1,
  user: testUser,
  linkKey: "abcdefg.test.com",
  href: "test.com",
  createAt: "string",
  updateAt: "string"
};

Adapter.onGet('/auth/ping').reply(() => {
  return [200, testUser]
});

Adapter.onGet('/auth/logout').reply(() => {
  return [200];
});

Adapter.onPost('/links', {user:1, href:"test.com"}).reply(() => {
  return [200, testLink];
});

export {mockClient}
