import {globalE2EMockClient} from './mocks/e2eClient'

export default {
  baseURL: 'http://localhost:8080', // The base url of the backend project
  globalE2EMock: true,
  globalE2EMockClient: globalE2EMockClient,
}