<<<<<<< HEAD
import {IUser} from "./IUser";

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
    user: IUser;
    csrfToken: string;
    accessToken: string;
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
