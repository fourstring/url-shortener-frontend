import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {BaseService} from "../services/BaseService";
import {LinkService} from "../services/LinkService";
import {AuthService} from "../services/AuthService";

let testClient = axios.create();
let testAdapter = new MockAdapter(testClient);

export const testBaseService = new BaseService<string>(testClient);
export const testLinkService = new LinkService(testClient);
export const testAuthService = new AuthService(testClient);

export {testAdapter}