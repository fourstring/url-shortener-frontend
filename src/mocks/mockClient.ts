import MockAdapter from "axios-mock-adapter";
import axios from "axios";


export const mockClient = axios.create({
    withCredentials: true
});
