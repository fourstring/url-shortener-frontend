<<<<<<< HEAD
import {client} from "../utils/network";
import {AxiosInstance} from "axios";
import {IBaseService, IRequestFilterOptions} from "./ServiceInterfaces";
import {IPagedData} from "../types/IHAL";
//var urlJoin = require('url-join'); // import url-join

export class BaseService<T, InputT = T> implements IBaseService<T, InputT> {
    resourceName: string = '';
    endpoint: string = '';
    client: AxiosInstance;

    constructor(Client ?: AxiosInstance) {
        this.client = Client ? Client:client;
    }

    async delete(id: number): Promise<boolean> {
        //let fullUrl = urlJoin(this.endpoint, `/${id}`);
        let result = await this.client.delete<T>(this.endpoint + `/${id}`);
        return result.status === 200;
    }

    async get(id: number): Promise<T> {
        //let fullUrl = urlJoin(this.endpoint, `/${id}`);
        let result = await this.client.get<T>(this.endpoint + `/${id}`);
        return result.data;
    }

    async getAll(filterOption?: IRequestFilterOptions<T>): Promise<IPagedData<T>> {
        let {...params} = filterOption;
        let result = await this.client.get<IPagedData<T>>(this.endpoint, {
            params
        });
        return result.data;
    }

    async patch(id: number, data: Partial<InputT>): Promise<T> {
        //let fullUrl = urlJoin(this.endpoint, `/${id}`);
        let result = await this.client.patch<T>(this.endpoint + `/${id}`, data);
        return result.data;
    }

    async post(data: InputT): Promise<T> {
        let result = await this.client.post<T>(this.endpoint, data);
        return result.data;
    }

    async put(id: number, data: InputT): Promise<T> {
        //let fullUrl = urlJoin(this.endpoint, `/${id}`);
        let result = await this.client.put<T>(this.endpoint + `/${id}`, data);
        return result.data;
    }
}
=======
import {client as normalClient} from "../utils/network";
import {AxiosInstance, AxiosResponse} from "axios";
import {EntityService, IRequestFilterOptions} from "./ServiceInterfaces";
import {IPagedData} from "../types/IPage";

const urljoin = require('url-join');

export class BaseService<T, InputT = T> implements EntityService<T, InputT> {
  endpoint: string = '';
  client: AxiosInstance;

  constructor(client ?: AxiosInstance) {
    this.client = client || normalClient;
  }

  async delete(id: number): Promise<boolean> {
    let fullUrl: string = urljoin(this.endpoint, `${id}`);
    let result = await this.client.delete<T>(fullUrl);
    return result.status === 200;
  }

  async get(id: number): Promise<T> {
    let fullUrl: string = urljoin(this.endpoint, `${id}`);
    let result = await this.client.get<T>(fullUrl);
    return result.data;
  }

  async getAll(filterOption?: IRequestFilterOptions<T>): Promise<IPagedData<T>> {
    let {...params} = filterOption;
    let result = await this.client.get<IPagedData<T>>(this.endpoint, {
      params
    });
    return result.data;
  }

  async patch(id: number, data: Partial<InputT>): Promise<T> {
    let fullUrl: string = urljoin(this.endpoint, `${id}`);
    let result = await this.client.patch<Partial<InputT>, AxiosResponse<T>>(fullUrl, data);
    return result.data;
  }

  async post(data: InputT): Promise<T> {
    let result = await this.client.post<InputT, AxiosResponse<T>>(this.endpoint, data);
    return result.data;
  }

  async put(id: number, data: InputT): Promise<T> {
    let fullUrl: string = urljoin(this.endpoint, `${id}`);
    let result = await this.client.put<InputT, AxiosResponse<T>>(fullUrl, data);
    return result.data;
  }

}
>>>>>>> dev
