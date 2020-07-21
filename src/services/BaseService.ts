import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {client as Client} from "../utils/network";
import {IBaseService, IPagedData, IRequestFilterOptions} from "./ServiceInterfaces";
var urljoin = require('url-join');

export class BaseService <T, InputT = T> implements IBaseService<T, InputT> {
    client: AxiosInstance;
    endpoint: string = '';

    constructor(client?:AxiosInstance) {
        this.client = client ? client : Client;
        console.log(this.client); // test
    }

    async delete(id: number): Promise<boolean> {
        let fullUrl : string = urljoin(this.endpoint, `${id}`);
        let result = await this.client.delete<T>(fullUrl);
        return result.status === 200;
    }

    async get(id: number): Promise<T> {
        let fullUrl : string = urljoin(this.endpoint, `${id}`);
        let result = await this.client.get<T>(fullUrl);
        return result.data;
    }

    async getAll(filterOption ?: IRequestFilterOptions<T>): Promise<IPagedData<T>> {
        let {...params} = filterOption;
        let result = await this.client.get<IPagedData<T>>(this.endpoint, {
            params
        });
        return result.data;
    }

    async patch(id: number, data: Partial<InputT>): Promise<T> {
        let fullUrl : string = urljoin(this.endpoint, `${id}`);
        let result = await this.client.patch<Partial<InputT>, AxiosResponse<T>>(fullUrl, data);
        return result.data;
    }

    async post(data: InputT): Promise<T> {
        let result = await this.client.post<InputT, AxiosResponse<T>>(this.endpoint, data);
        return result.data;
    }

    async put(id: number, data: InputT): Promise<T> {
        let fullUrl : string = urljoin(this.endpoint, `${id}`);
        let result = await this.client.put<InputT, AxiosResponse<T>>(fullUrl, data);
        return result.data;
    }

}
