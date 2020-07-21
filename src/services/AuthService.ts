import {AxiosInstance} from "axios";
import {ILoginCredential, IRegisterCredential,ILoginResult} from "../types/IAuth";
import {IUser} from "../types/IUser";
import {client} from "../utils/network";

export class AuthService {
    client: AxiosInstance;

    constructor(Client ?: AxiosInstance) {
        this.client = Client ? Client:client;
    }

    async login(cred: ILoginCredential): Promise<IUser> {
        try {
            let result = await this.client.post<ILoginResult>('/auth/login', cred);
            localStorage.setItem('access_token', result.data.accessToken);
            localStorage.setItem('csrf_token', result.data.csrfToken);
            return result.data.user;
        } catch (e) {
            throw e;
        }
    }

    async logout() {
        try {
            let result =  await this.client.get('/auth/logout');
            localStorage.removeItem('access_token');
            localStorage.removeItem('csrf_token');
            return result.status === 200;
        }catch (e) {
            throw e;
        }
    }

    async ping(): Promise<IUser|null> {
        try {
            let result = await this.client.get<IUser>('/auth/ping');
            return result.data;
        } catch (e) {
            if(!(e.isAxiosError && e.response.status === 403)){
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
            if(e.isAxiosError && e.response.status === 400){
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
            if(e.isAxiosError && e.response.status === 403){
                return false;
            }
            throw e;
        }
    }

    async refresh(): Promise<boolean>{
        try {
            let result = await this.client.get('/auth/refresh');
            localStorage.setItem('access_token', result.data.accessToken);
            return true;
        } catch (e) {
            if(e.isAxiosError && e.response.status === 403){
                return false;
            }
            throw e;
        }
    }
}

export const authService = new AuthService();