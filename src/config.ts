import {globalE2EMockClient} from './mocks/e2eClient'

export default {
  baseURL: 'https://api.fourstring.dev', // The base url of the backend project
  globalE2EMock: false,
  globalE2EMockClient: globalE2EMockClient,
  jwtMonitorRate: 60000, //ms
  jwtRefreshThreshold: 120, //s
  shortenLinkBaseURL: 'https://api.fourstring.dev'
}
