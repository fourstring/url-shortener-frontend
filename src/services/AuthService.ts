import {AxiosInstance, AxiosError} from "axios";
import {client as Client, client} from "../utils/network";
import {ILoginCredential, IRegisterCredential,ILoginResult} from "../types/IAuth";
import { IUser } from "../types/IUser";

export class AuthService {
    client: AxiosInstance;

    constructor(client?:AxiosInstance) {
        this.client = client ? client : Client;
        console.log(this.client); // test
    }

    async login(cred: ILoginCredential): Promise<IUser> {
        let result = await this.client.post<ILoginResult>('/auth/login', cred);
        localStorage.setItem('csrf_token', result.data.csrfToken); // Set csrfToken localStorage for further requests.
        localStorage.setItem('access_token', result.data.accessToken);
        return result.data.user;
    }

    async logout() {
        await this.client.get('/auth/logout');
        localStorage.removeItem('csrf_token'); // Clear csrfToken stored.
        localStorage.removeItem('access_token');
    }

    async ping(): Promise<IUser|null> {
        try {
            let result = await this.client.get<IUser>('/auth/ping');
            return result.data;
        } catch (e) {
            if(e.isAxiosError && e.response.status === 403) return null;
            throw e;
        }
    }

    async register(profile: IRegisterCredential): Promise<boolean> {
        try {
            let result = await this.client.post('/auth/register', profile);
            return result.status === 200;
        } catch (e) {
            if(e.isAxiosError && e.response.status === 400) return false;
            throw e;
        }
    }

    async checkExists(username?: string, email?:string):Promise<boolean>{
        try {
            let result = await this.client.post('/auth/exist', {
                username: username, email: email
            });
            return result.status === 200;
        } catch (e) {
            if(e.isAxiosError && e.response.status === 403) return false;
            throw e;
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
            if(e.isAxiosError && e.response.status === 403) return false;
            throw e;
        }
    }
}

export const authService = new AuthService();
