import axios from "axios"
import config from "../config";

const client = axios.create({
    baseURL: config.baseURL,
    withCredentials: true
});

client.interceptors.request.use(config => {
    // Due to cross domain restriction of Cookies, we use localStorage to store CSRFtoken.
    let csrfToken: string | null = localStorage.getItem('csrf_token');
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
});

client.interceptors.response.use(undefined, error => {
});

export {client};
