import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const baseURL:string = 'http://localhost:8080';

let globalE2EMockClient = axios.create({
  baseURL: baseURL,
});

let Adapter = new MockAdapter(globalE2EMockClient, {delayResponse: 1000});

export {globalE2EMockClient,Adapter}