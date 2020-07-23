import {AxiosInstance} from 'axios';
import {IPagedData} from '../types/IPage'
import MockAdapter from "axios-mock-adapter";

export interface IRequestFilterOptions<T> {
  page: number;
  size: number;
  fields: (keyof T)[];

  [name: string]: any;
}

export interface EntityService<T, InputT = T> {
  endpoint: string; //该Service所要请求的 RESTFUL API的路径
  client: AxiosInstance | MockAdapter; //该Service发起请求时所使用的 Axios client

  get(id: number): Promise<T>;

  getAll(filterOption?: IRequestFilterOptions<T>): Promise<IPagedData<T>>;

  post(data: InputT): Promise<T>;

  put(id: number, data: InputT): Promise<T>;

  patch(id: number, data: Partial<InputT>): Promise<T>;

  delete(id: number): Promise<boolean>;
}
