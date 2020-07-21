import {IUser} from "./IUser";

export interface ILinkInput {
    user:number;
}

export interface ILink{
    id: number;
    user:IUser;
    linkKey: string;
    href: string;
    createAt: string;
    updateAt: string;
}