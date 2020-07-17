import {IUser} from "./IUser";
import * as H from 'history';

export enum IAuthStatus {
    SUCCESS,
    REJECTED
}

export interface IAuthCredential {
    username: string;
    password: string;
}

export interface IAuthRespData {
    user: IUser;
    csrfToken: string;
}

export interface IAuthResult {
    status: IAuthStatus;
    user: IUser | null;
}

export interface IAuthRedirectState {
    from: Partial<H.Location>;
}

export interface IRegisterCredential {
    username: string;
    password: string;
    email: string;
}
