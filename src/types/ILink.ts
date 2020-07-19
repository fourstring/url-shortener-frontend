import {IUserInfo} from "./IUserInfo";

export interface ILink {
    id: number;
    user: IUserInfo;
    linkKey: string;
    href: string;
    createAt: string;
    updateAt: string;
}
