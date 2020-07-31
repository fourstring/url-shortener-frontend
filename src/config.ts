import {globalE2EMockClient} from './mocks/e2eClient'

let config: Record<string, any> = {};
if (process.env["CI"]) {
  config = {
    baseURL: 'https://api.fourstring.dev', // The base url of the backend project
    globalE2EMock: true,
    globalE2EMockClient: globalE2EMockClient,
    jwtMonitorRate: 60000, //ms
    jwtRefreshThreshold: 120, //s
    shortenLinkBaseURL: 'https://api.fourstring.dev/s'
  }
} else {
  config = {
    baseURL: 'https://api.fourstring.dev', // The base url of the backend project
    globalE2EMock: true,
    globalE2EMockClient: globalE2EMockClient,
    jwtMonitorRate: 60000, //ms
    jwtRefreshThreshold: 120, //s
    shortenLinkBaseURL: 'https://api.fourstring.dev/s'
  }
}
export default config;
