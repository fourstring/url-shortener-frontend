import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {testUser} from "./testData";

const baseURL:string = 'http://localhost:8080';

let globalE2EMockClient = axios.create({
  baseURL: baseURL,
});

let Adapter = new MockAdapter(globalE2EMockClient);

/* you can add your e2e mock freely  */
Adapter.onGet(baseURL+'/auth/ping').reply(config => {
  return [200, testUser]
});

Adapter.onGet(baseURL+'/auth/logout').reply(config => {
  return [200]
});

Adapter.onPost(baseURL+'/auth/login').reply(config => {
  return [200, {user: testUser, accessToken: "justTestToken", csrfToken: "justTestToken"}]
});

export {globalE2EMockClient}