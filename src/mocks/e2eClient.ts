import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {testUser} from "./testData";
import {ILink} from "../types/ILink";

const baseURL: string = 'http://localhost:8080';
export const testLink: ILink = {
  id: 1,
  user: testUser,
  linkKey: "abcdefg.test.com",
  href: "test.com",
  createAt: "string",
  updateAt: "string"
};

let globalE2EMockClient = axios.create({
  baseURL: baseURL,
});

let Adapter = new MockAdapter(globalE2EMockClient);

/* you can add your e2e mock freely  */
Adapter.onGet(baseURL+'/auth/ping').reply(config => {
  return [200, testUser]
});

Adapter.onGet(baseURL + '/auth/logout').reply(config => {
  return [200]
});

Adapter.onPost(baseURL + '/auth/login').reply(config => {
  return [200, {user: testUser, accessToken: "justTestToken", csrfToken: "justTestToken"}]
});

Adapter.onPost('/links', {user: 1, href: "test.com"}).reply(() => {
  return [200, testLink];
});

export {globalE2EMockClient}
