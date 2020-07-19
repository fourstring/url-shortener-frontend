import {IUserInfo} from "./IUserInfo";

export interface ILoginResult {
    id: number;
    user: IUserInfo;
    accessToken: string;
    csrfToken: string;
}

export interface IRegisterCredential {
    username: string;
    password: string;
    email: string;
}

export interface ILoginCredential {
    username: string;
    password: string;
}
