import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {BaseService} from "../services/BaseService";

let client = axios.create();
let mock = new MockAdapter(client);
export const baseService = new BaseService<string>(client);

export{
    mock
}