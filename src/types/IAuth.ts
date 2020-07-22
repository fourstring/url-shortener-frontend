<<<<<<< HEAD
import {IUser} from "./IUser";

export interface ILoginResult {
    id: number;
    user: IUser;
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
=======
import {IUser} from "./IUser";

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
>>>>>>> dev
