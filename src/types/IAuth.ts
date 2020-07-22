import {IUser} from "./IUser";
import * as H from 'history';

export interface IAuthCredential {
  username: string;
  password: string;
}

export interface IAuthRespData {
  user: IUser;
  accessToken: string;
  csrfToken: string;
}

export interface IRegisterCredential {
  username: string;
  password: string;
  email: string;
}

export interface IAuthRedirectState {
  from: Partial<H.Location>;
}