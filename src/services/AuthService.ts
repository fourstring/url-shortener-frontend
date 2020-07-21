import {AxiosInstance} from "axios";
import {IAuthCredential, IAuthRespData, IRegisterCredential} from "../types/IAuth";
import {IUser} from "../types/IUser";
import {client} from "../utils/network";

export class AuthService {
    client: AxiosInstance;

    constructor(Client ?: AxiosInstance) {
        this.client = Client ? Client:client;
    }

    async login(cred: IAuthCredential): Promise<IUser> {
        try {
            let result = await this.client.post<IAuthRespData>('/auth/login', cred);
            localStorage.setItem('access_token', result.data.accessToken);// Set csrfToken localStorage for further requests.
            localStorage.setItem('csrf_token', result.data.csrfToken); // Set csrfToken localStorage for further requests.
            return result.data.user;
        } catch (e) {
            throw e;
        }
    }

    async logout() {
        try {
            let result =  await this.client.get('/auth/logout');
            localStorage.removeItem('access_token'); // Clear accessToken stored.
            localStorage.removeItem('csrf_token'); // Clear csrfToken stored.
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