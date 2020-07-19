import {AxiosInstance} from "axios";
import MockAdapter from "axios-mock-adapter";
import {IPagedData} from "../types/IHAL";

export interface IRequestFilterOptions<T> {
  page:number;
  size:number;
  fields:(keyof T)[];
  
  [name: string]:any;
}

export interface EntityService<T, InputT = T, R = T> {
  endpoint: string;
  resourceName: string;
  client: AxiosInstance | MockAdapter;

  transformResource(resource: R): T;

  get(id: number, filterOption?: IRequestFilterOptions<T>): Promise<T>;

  // TODO: Add paginator support( Pagination schema is unable to determine now ).
  getAll(filterOption?: IRequestFilterOptions<T>): Promise<IPagedData<T>>;

  post(data: InputT): Promise<T>;

  put(id: number, data: InputT): Promise<T>;

  patch(id: number, data: Partial<InputT>): Promise<T>;

  delete(id: number): Promise<boolean>;
}