import {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import MockAdapter from "axios-mock-adapter";
import {client} from "../utils/network";
import config from "../config";
import {mockClient} from "../mocks/mockClient";
import {IBaseService, IPagedData, IRequestFilterOptions} from "./ServiceInterfaces";
import {ILink} from "../types/ILink";
let urlJoin = require('url-join'); // import url-join

export class BaseService <T, InputT = T> implements IBaseService<T, InputT> {
    client: AxiosInstance;
    endpoint: string = '';

    constructor(mock:boolean=false) {
        this.client = config.globalMock ? mockClient : client;
        console.log(this.client); // test
    }

    transformResource(resource: T): T {
        throw new Error("Method not implemented.");
    }

    async delete(id: number): Promise<boolean> {
        let fullUrl = urlJoin(this.endpoint, `/${id}`);
        let result = await this.client.delete<T>(fullUrl);
        return result.status >= 200 && result.status <= 299;
    }

    async get(id: number): Promise<T> {
        let fullUrl = urlJoin(this.endpoint, id);
        let result = await this.client.get<T>(fullUrl);
        return result.data;
    }

    // TODO:属实不太行
    // 我是真的没懂接口的关系。
    async getAll(filterOption ?: IRequestFilterOptions<T>): Promise<IPagedData<T>> {
        let params = {
            page: filterOption?.page,
            size: filterOption?.size,
            fields: filterOption?.fields.join(",")
        };
        let result = await this.client.get<IPagedData<T>>(this.endpoint, {params});

        return result.data;
    }

    async patch(id: number, data: Partial<InputT>): Promise<T> {
        let fullUrl = urlJoin(this.endpoint, id);
        let result = await this.client.patch<Partial<InputT>, AxiosResponse<T>>(fullUrl, data);
        return this.transformResource(result.data);
    }

    async post(data: InputT): Promise<T> {
        let result = await this.client.post<InputT, AxiosResponse<T>>(this.endpoint, data);
        return this.transformResource(result.data);
    }

    async put(id: number, data: InputT): Promise<T> {
        let fullUrl = urlJoin(this.endpoint, id);
        let result = await this.client.put<InputT, AxiosResponse<T>>(fullUrl, data);
        return this.transformResource(result.data);
    }

}
