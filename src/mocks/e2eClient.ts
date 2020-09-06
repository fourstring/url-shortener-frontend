import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {testPagedData, testUser, testLink} from "./testData";
import {linkDb} from './mockDb'
import {ILink} from "../types/ILink";

const baseURL: string = 'http://localhost:8080';

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
  return [200, {user: testUser, accessToken: "justTestToken", csrfToken: "justTestToken"}]
});

testAdapter.onPost('/links', {user: 1, href: "test.com"}).reply(() => {
  return [200, testLink];
});

testAdapter.onGet('/links').reply(config => {
  return [200, testPagedData]
});

testAdapter.onGet('/admin/links').reply(config => {
  const {page, size} = config.params;
  let result: ILink[] = [];
  for (let i = (page - 1) * size + 1; i <= page * size; i++) {
    const link = linkDb.get(i);
    if(link) result.push(link);
  }
  return [200, {
    count: 10,
    results: result,
  }]
})

testAdapter.onPatch(/\/admin\/links\/\d+/).reply(config => {
  const reg = new RegExp(/\/links\/(\d+)/);
  if (config.url) {
    const match = config.url.match(reg);
    if (match) {
      const id = parseInt(match[1]);
      const res = linkDb.get(id);
      if (res) res.disabled = !res.disabled;
      return [200, res]
    }
  }
  return [404]
})

testAdapter.onDelete(/\/admin\/links\/\d+/).reply(config => {
  const reg = new RegExp(/\/links\/(\d+)/);
  if (config.url) {
    const match = config.url.match(reg);
    if (match) {
      const id = parseInt(match[1]);
      if (linkDb.has(id)) {
        linkDb.delete(id);
        return [200]
      }
    }
  }
  return [404]
})

testAdapter.onPost('/admin/links').reply(config => {
  const {href, linkKey} = config.data
  const link: ILink = {
    id: linkDb.size+1,
    user: testUser,
    href: href as string,
    linkKey: linkKey as string,
    createAt: "2020-09-07",
    updateAt: "2020-09-07",
    disabled: false
  }
  linkDb.set(linkDb.size+1, link)
  return [200, link]
})

export {globalE2EMockClient}
