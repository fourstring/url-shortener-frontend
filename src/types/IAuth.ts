import {IUserInfo} from "./IUserInfo";

export interface ILoginCredential {
  username: string;
  password: string;
}

export interface IRegisterCredential {
  username: string;
  password: string;
  email: string;
}

export interface ILoginResult{
  id: number;
  user: IUserInfo;
  csrfToken: string;
  accessToken: string;
}
