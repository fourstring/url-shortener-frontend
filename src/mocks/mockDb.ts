import {IUser} from "../types/IUser";
import {ILink} from "../types/ILink";

function fillDb<T extends any>(db: Map<number, T>, key: string = "id") {
  return (value: T) => db.set(value[key] as number, value);
}

let user: IUser[] = [
  {id: 1, username: 'test1', email: 'test@test.com', admin: false},
  {id: 2, username: 'test2', email: 'test@test2.com', admin: false},
  {id: 3, username: 'test3', email: 'test@test3.com', admin: false},
  {id: 4, username: 'admin', email: 'admin@test.com', admin: true}
];

let link: ILink[] = [
  {
    id: 1,
    user: user[0],
    linkKey: "NNr96e",
    href: "https://nimo.sjtu.edu.cn/",
    createAt: "2020-07-20",
    updateAt: "2020-07-20"
  },
  {
    id: 2,
    user: user[0],
    linkKey: "NNr96e",
    href: "https://github.com/fourstring/url-shortener-frontend",
    createAt: "2020-07-20",
    updateAt: "2020-07-20"
  },
  {
    id: 3,
    user: user[1],
    linkKey: "A7PKCQ",
    href: "https://nimo.sjtu.edu.cn/",
    createAt: "2020-07-21",
    updateAt: "2020-07-21"
  },
  {
    id: 4,
    user: user[1],
    linkKey: "NNr96e",
    href: "https://github.com/fourstring/url-shortener-frontend",
    createAt: "2020-07-20",
    updateAt: "2020-07-20"
  },
  {
    id: 5,
    user: user[1],
    linkKey: "A7PKCQ",
    href: "https://nimo.sjtu.edu.cn/",
    createAt: "2020-07-20",
    updateAt: "2020-07-20"
  },
  {
    id: 6,
    user: user[1],
    linkKey: "NNr96e",
    href: "https://github.com/fourstring/url-shortener-frontend",
    createAt: "2020-07-20",
    updateAt: "2020-07-20"
  },
  {
    id: 7,
    user: user[2],
    linkKey: "A7PKCQ",
    href: "https://nimo.sjtu.edu.cn/",
    createAt: "2020-07-20",
    updateAt: "2020-07-20"
  },
  {
    id: 8,
    user: user[2],
    linkKey: "NNr96e",
    href: "https://github.com/fourstring/url-shortener-frontend",
    createAt: "2020-07-20",
    updateAt: "2020-07-20"
  },
  {
    id: 9,
    user: user[3],
    linkKey: "A7PKCQ",
    href: "https://nimo.sjtu.edu.cn/",
    createAt: "2020-07-20",
    updateAt: "2020-07-20"
  },
  {
    id: 10,
    user: user[3],
    linkKey: "NNr96e",
    href: "https://github.com/fourstring/url-shortener-frontend",
    createAt: "2020-07-20",
    updateAt: "2020-07-20"
  },
];

let userDb = new Map<number, IUser>();
user.forEach(fillDb<IUser>(userDb));

let linkDb = new Map<number, ILink>();
link.forEach(fillDb<ILink>(linkDb));

export {
  userDb,
  linkDb,
  user,
  link
}
