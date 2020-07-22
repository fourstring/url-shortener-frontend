import {ILoginResult, ILoginCredential, IRegisterCredential} from "../types/IAuth"
import {ILink} from "../types/ILink"
import {IUser} from "../types/IUser"

function fillDb<T extends any>(db: Map<number, T>, key: string = "id") {
    return (value: T) => db.set(value[key] as number, value);
}

let Users: IUser[] = [
    {id: 1, username: 'test1', email: 'test@test.com'},
    {id: 2, username: 'test2', email: 'test@test2.com'},
    {id: 3, username: 'test3', email: 'test@test3.com'},
    {id: 4, username: 'admin', email: 'admin@test.com'}
];

let userDb = new Map<number, IUser>();
Users.forEach(fillDb<IUser>(userDb));

let links: ILink[] = [
    {id: 1, user: userDb.get(1) as IUser, linkKey: 'example.com/1', href: 'example.com/jaskdhlajdhklas/sfhalfh?jhkadsml=21312', createAt: 'test', updateAt: 'test'},
    {id: 2, user: userDb.get(2) as IUser, linkKey: 'example.com/2', href: '', createAt: '', updateAt: ''},
    {id: 3, user: userDb.get(2) as IUser, linkKey: 'example.com/3', href: '', createAt: '', updateAt: ''},
    {id: 4, user: userDb.get(3) as IUser, linkKey: 'example.com/4', href: '', createAt: '', updateAt: ''},
    {id: 5, user: userDb.get(3) as IUser, linkKey: 'example.com/5', href: '', createAt: '', updateAt: ''},
    {id: 6, user: userDb.get(3) as IUser, linkKey: 'example.com/6', href: '', createAt: '', updateAt: ''},
    {id: 7, user: userDb.get(4) as IUser, linkKey: 'example.com/7', href: '', createAt: '', updateAt: ''},
    {id: 8, user: userDb.get(4) as IUser, linkKey: 'example.com/8', href: '', createAt: '', updateAt: ''},
    {id: 9, user: userDb.get(4) as IUser, linkKey: 'example.com/9', href: '', createAt: '', updateAt: ''},
    {id: 10, user: userDb.get(4) as IUser, linkKey: 'example.com/10', href: '', createAt: '', updateAt: ''},
    {id: 11, user: userDb.get(1) as IUser, linkKey: 'example.com/11', href: '', createAt: '', updateAt: ''},
];

let linkDb = new Map<number, ILink>();
links.forEach(fillDb<ILink>(linkDb, "id"));

export {
    userDb,
    linkDb
};
