import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {testAdmin, testPagedData, testUser} from "./testData";
import {ILink} from "../types/ILink";

const baseURL: string = 'http://localhost:8080';
export const testLink: ILink = {
  id: 1,
  user: testUser,
  linkKey: "abcdefg",
  href: "test.com",
  createAt: "string",
  updateAt: "string"
};

let globalE2EMockClient = axios.create({
  baseURL: baseURL,
});

let testAdapter = new MockAdapter(globalE2EMockClient);

/* you can add your e2e mock freely  */
testAdapter.onGet(baseURL + '/auth/ping').reply(config => {
  return [200, testUser]
});

testAdapter.onGet(baseURL + '/auth/logout').reply(config => {
  return [200]
});

testAdapter.onPost(baseURL + '/auth/login').reply(config => {
  const data = JSON.parse(config.data);
  if (data.username === 'admin') {
    return [200, {user: testAdmin, accessToken: "justTestToken", csrfToken: "justTestToken"}]
  }
  return [200, {user: testUser, accessToken: "justTestToken", csrfToken: "justTestToken"}]
});

testAdapter.onPost('/links', {user: 1, href: "test.com"}).reply(() => {
  return [200, testLink];
});

testAdapter.onGet('/links').reply(config => {
  return [200, testPagedData]
});

export {globalE2EMockClient}
