import axios from "axios"
import config from "../config";

const client = axios.create({
    baseURL: config.baseURL,
});

client.interceptors.request.use(config => {
    let csrfToken: string | null = localStorage.getItem('csrf_token');
    let accessToken: string | null = localStorage.getItem('access_token');
    if (csrfToken) config.headers['X-CSRFToken'] = csrfToken;
    if (accessToken)  config.headers['Authorization'] = accessToken;
    return config;
});

export {client};
