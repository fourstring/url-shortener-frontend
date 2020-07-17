import {AxiosInstance} from "axios";
import config from "../config";
import {mockClient} from "../mocks/mockClient";
import {client} from "../utils/network";
import {IAuthCredential, IAuthRespData, IAuthResult, IAuthStatus, IRegisterCredential} from "../types/IAuth";

export class AuthService {
    client: AxiosInstance;

    constructor() {
        if (config.globalMock) {
            this.client = mockClient;
        } else {
            this.client = client;
        }
    }

    async login(cred: IAuthCredential): Promise<IAuthResult> {
        try {
            let result = await this.client.post<IAuthRespData>('/auth/login', cred);
            if (result.status >= 200 && result.status <= 299) {
                localStorage.setItem('csrf_token', result.data.csrfToken); // Set csrfToken localStorage for further requests.
                return {status: IAuthStatus.SUCCESS, user: result.data.user}
            }
            return {status: IAuthStatus.REJECTED, user: null}
        } catch (e) {
            return {status: IAuthStatus.REJECTED, user: null}
        }
    }

    async logout() {
        try {
            await this.client.get('/logout');
        } catch (e) {
            localStorage.removeItem('csrf_token'); // Clear csrfToken stored.
        }
        return true;
    }

    async ping(): Promise<IAuthResult> {
        try {
            let result = await this.client.get<IAuthRespData>('/auth/ping');
            if (result.status >= 200 && result.status <= 299) {
                localStorage.setItem('csrf_token', result.data.csrfToken); // Set csrfToken localStorage for further requests.
                return {status: IAuthStatus.SUCCESS, user: result.data.user}
            }
            return {status: IAuthStatus.REJECTED, user: null}
        } catch (e) {
            return {status: IAuthStatus.REJECTED, user: null}
        }
    }

    async register(profile: IRegisterCredential): Promise<boolean> {
        try {
            let result = await this.client.post('/auth/register', profile);
            return result.status >= 200 && result.status <= 299;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    async checkUsername(username: string): Promise<boolean> {
        try {
            let result = await this.client.get('/auth/check_username', {
                params: {
                    username
                }
            });
            return result.status >= 200 && result.status <= 299;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

export const authService = new AuthService();