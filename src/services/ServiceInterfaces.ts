import {AxiosInstance} from "axios";
import MockAdapter from "axios-mock-adapter";

export interface IPagedData<T> {
    count:number;
    results:T[];
}

export interface IRequestFilterOptions<T> {
    page:number;
    size:number;
    fields:(keyof T)[];

    [name: string]:any;
}

export interface IBaseService<T, InputT = T> {
    endpoint: string;
    client: AxiosInstance;

    get(id: number): Promise<T>;

    getAll(filterOption?: IRequestFilterOptions<T>): Promise<IPagedData<T>>;

    post(data: InputT): Promise<T>;

    put(id: number, data: InputT): Promise<T>;

    patch(id: number, data: Partial<InputT>): Promise<T>;

    delete(id: number): Promise<boolean>;
}
