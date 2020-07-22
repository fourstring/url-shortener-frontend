import {client} from "../utils/network";
import {AxiosInstance} from "axios";
import {EntityService, IRequestFilterOptions} from "./ServiceInterfaces";
import {IPagedData} from "../types/IPage";

export class BaseService<T, InputT = T> implements EntityService<T, InputT> {
  resourceName: string = '';
  endpoint: string = '';
  client: AxiosInstance;

  constructor(Client ?: AxiosInstance) {
    this.client = Client ? Client : client;
  }

  async delete(id: number): Promise<boolean> {
    let result = await this.client.delete<T>(this.endpoint + `/${id}`);
    return result.status === 200;
  }

  async get(id: number): Promise<T> {
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
    let result = await this.client.patch<T>(this.endpoint + `/${id}`, data);
    return result.data;
  }

  async post(data: InputT): Promise<T> {
    let result = await this.client.post<T>(this.endpoint, data);
    return result.data;
  }

  async put(id: number, data: InputT): Promise<T> {
    let result = await this.client.put<T>(this.endpoint + `/${id}`, data);
    return result.data;
  }
}
