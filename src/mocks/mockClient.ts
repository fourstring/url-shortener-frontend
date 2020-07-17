import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const mockClient = axios.create({
    // `withCredentials` indicates whether or not cross-site Access-Control requests
    withCredentials: true
});

const mock = new MockAdapter(mockClient, {delayResponse: 1000});

mock.onGet('/')

export {mockClient};