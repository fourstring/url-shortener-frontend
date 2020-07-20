import {IUser} from "./IUser";

export interface ILink {
    id: number;
    user: IUser;
    linkKey: string;
    href: string;
    createAt: string;
    updateAt: string;
}
