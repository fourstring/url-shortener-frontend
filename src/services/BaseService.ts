import config from "../config";
import {client} from "../utils/network";
import {AxiosInstance, AxiosResponse} from "axios";
import {EntityService, IRequestFilterOptions} from "./ServiceInterfaces";
import {mockClient} from "../mocks/mockClient";
import {IHalList, IPagedData} from "../types/IHAL";
let urljoin = require('url-join');

export class BaseService<T, InputT = T, R = T> implements EntityService<T, InputT, R> {
  resourceName: string = '';
  endpoint: string = '';
  client: AxiosInstance;

  constructor() {
    this.client = config.globalMock ? mockClient : client;
    console.log(this.client);
    console.log(config.globalMock);
  }

  transformResource(resource: R): T {
    throw new Error("Method not implemented.");
  }
  async delete(id: number): Promise<boolean> {
    //let result = await this.client.delete<T>(this.endpoint + `/${id}`);
    let result = await this.client.delete<T>(urljoin(this.endpoint, id ));
    return result.status >= 200 && result.status <= 299;
  }

  async get(id: number): Promise<T> {
    //endpoint += `/${id}`;
    let fullUrl = urljoin(this.endpoint, id);
    let result = await this.client.get<T>(fullUrl);
    return result.data;
  }

  // TODO
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
    let result = await this.client.patch<Partial<InputT>, AxiosResponse<R>>(urljoin(this.endpoint,id), data);
    return this.transformResource(result.data);
  }

  async post(data: Partial<InputT>): Promise<T> {
    let result = await this.client.post<InputT, AxiosResponse<R>>(this.endpoint, data);
    return this.transformResource(result.data);
  }

  async put(id: number, data: InputT): Promise<T> {
    let result = await this.client.put<InputT, AxiosResponse<R>>(urljoin(this.endpoint,id), data);
    return this.transformResource(result.data);
  }

}