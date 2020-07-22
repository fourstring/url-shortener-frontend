import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {BaseService} from "../services/BaseService";
import {LinkService} from "../services/LinkService";
import {AuthService} from "../services/AuthService";
import {IPagedData} from "../types/IPage";
import {ILink} from "../types/ILink";
import {IRequestFilterOptions} from "../services/ServiceInterfaces";
import {IUser} from "../types/IUser";

let client = axios.create();
let mock = new MockAdapter(client);

export const baseService = new BaseService<string>(client);
export const linkService = new LinkService(client);
export const authService = new AuthService(client);

/* const data use to mock */
export const user: IUser = {id: 1, username: 'string', email: "user@example.com"};

export const iLink : ILink = {
    id: 1,
    user: user,
    linkKey: "string",
    href: "string",
    createAt: "string",
    updateAt: "string"
}

export const iLinkList: ILink[] = [
    iLink
]

export const iPagedData: IPagedData<ILink> = {
    count: 10,
    results: iLinkList,
}

export const iLinkInput = {
    user: 1,
    href: "string",
}

export const requestFilterOptions: IRequestFilterOptions<ILink> = {
    page: 1,
    size: 10,
    fields: []
};

export { mock }