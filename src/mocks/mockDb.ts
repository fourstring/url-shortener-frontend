import {ILink} from "../types/ILink";
import {IUser} from "../types/IUser";

function fillDb<T extends any>(db: Map<number, T>, key: string = "id") {
    return (value: T) => db.set(value[key] as number, value);
}

let users: IUser[] = [
    {id: 1, username: 'test1', email: 'test@test.com'},
    {id: 2, username: 'test2', email: 'test@test2.com'},
    {id: 3, username: 'test3', email: 'test@test3.com'},
];

let userDb = new Map<number, IUser>();
users.forEach(fillDb<IUser>(userDb));

let links: ILink[] = [
    {
        id: 1,
        user:{id:1,username: 'test1'},
        linkKey: "https://sourl.cn/A7PKCQ",
        href:"https://nimo.sjtu.edu.cn/"
    },
    {
        id: 2,
        user:{id:1,username: 'test1'},
        linkKey: "https://sourl.cn/NNr96e",
        href:"https://github.com/fourstring/url-shortener-frontend"
    },
];

let linkDb = new Map<number, ILink>();
links.forEach(fillDb<ILink>(linkDb));

export {userDb, linkDb}
// export {userDb, linkDb}