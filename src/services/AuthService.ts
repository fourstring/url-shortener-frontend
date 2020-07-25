import {AxiosInstance} from "axios";
import {IAuthCredential, IAuthRespData, IRegisterCredential} from "../types/IAuth";
import {IUser} from "../types/IUser";
import {client as normalClient} from "../utils/network";
import config from "../config";

export class AuthService {
  client: AxiosInstance;

  constructor(client ?: AxiosInstance){
    if(client){
      this.client = client;
    }else if(config.globalE2EMock){
      this.client = config.globalE2EMockClient;
    }else{
      this.client = normalClient;
    }
  }

  async login(cred: IAuthCredential): Promise<IUser> {
    let result = await this.client.post<IAuthRespData>('/auth/login', cred);
    localStorage.setItem('access_token', result.data.accessToken);// Set csrfToken localStorage for further requests.
    localStorage.setItem('csrf_token', result.data.csrfToken); // Set csrfToken localStorage for further requests.
    return result.data.user;
  }

  async logout() {
    let result = await this.client.get('/auth/logout');
    localStorage.removeItem('access_token'); // Clear accessToken stored.
    localStorage.removeItem('csrf_token'); // Clear csrfToken stored.
    return result.status === 200;
  }

  async ping(): Promise<IUser | null> {
    try {
      let result = await this.client.get<IUser>('/auth/ping');
      return result.data;
    } catch (e) {
      if (!(e.isAxiosError && e.response.status === 403)) {
        throw e;
      }
    }
    return null;
  }

  async register(profile: IRegisterCredential): Promise<boolean> {
    try {
      let result = await this.client.post('/auth/register', profile);
      return result.status === 200;
    } catch (e) {
      if (e.isAxiosError && e.response.status === 400) {
        return false;
      }
      throw e;
    }
  }

  async checkExists(username?: string, email?: string): Promise<boolean> {
    try {
      let result = await this.client.post('/auth/exist', {
        username: username, email: email
      });
      return result.status === 200;
    } catch (e) {
      if (e.isAxiosError && e.response.status === 403) {
        return false;
      }
      throw e;
    }
  }

  async refresh(): Promise<boolean> {
    try {
      let result = await this.client.get('/auth/refresh');
      localStorage.setItem('access_token', result.data.accessToken);
      return true;
    } catch (e) {
      if (e.isAxiosError && e.response.status === 403) {
        return false;
      }
      throw e;
    }
  }
}

export const authService = new AuthService();
