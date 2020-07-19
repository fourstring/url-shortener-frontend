import {AxiosInstance} from "axios";
import config from "../config";
import {mockClient} from "../mocks/mockClient";
import {client} from "../utils/network";
import {ILoginCredential, IRegisterCredential,ILoginResult} from "../types/IAuth";
import { IUserInfo } from "../types/IUserInfo";

export class AuthService {
    client: AxiosInstance;

    constructor() {
        if (config.globalMock) {
            this.client = mockClient;
        } else {
            this.client = client;
        }
    }

    async login(cred: ILoginCredential): Promise<IUserInfo|null> {
        try {
            let result = await this.client.post<ILoginResult>('/auth/login', cred);
            if (result.status >= 200 && result.status <= 299) {
                localStorage.setItem('csrf_token', result.data.csrfToken); // Set csrfToken localStorage for further requests.
                localStorage.setItem('access_token', result.data.accessToken);
                return result.data.user
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    async logout() {
        try {
            await this.client.get('/logout');
        } catch (e) {
            localStorage.removeItem('csrf_token'); // Clear csrfToken stored.
            localStorage.removeItem('access_token');
        }
        return true;
    }

    async ping(): Promise<IUserInfo|null> {
        try {
            let result = await this.client.get<ILoginResult>('/auth/ping');
            if (result.status !== 403) {
                localStorage.setItem('csrf_token', result.data.csrfToken); // Set csrfToken localStorage for further requests.
                localStorage.setItem('access_token', result.data.accessToken);
                return  result.data.user
            }
            return null;
        } catch (e) {
            return null;
        }
    }

    async register(profile: IRegisterCredential): Promise<boolean> {
        try {
            let result = await this.client.post('/auth/register', profile);
            return result.status !== 400;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async checkExists(username?: string, email?:string):Promise<boolean>{
        try {
            let result = await this.client.get('/auth/exist', {
                params: {
                    username,
                    email
                }
            });
            return result.status !== 403;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async refresh(): Promise<boolean>{

        try{
            let result = await this.client.get('/auth/refresh');
            localStorage.setItem('access_token', result.data.accessToken);
            return true;
        }
        catch(e){
            console.log(e);
            // TODO:重新登陆路由
            return false;
        }

    }
}

export const authService = new AuthService();
