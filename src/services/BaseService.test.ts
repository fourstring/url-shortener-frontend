import {BaseService} from './BaseService'
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

let client = axios.create();
let mock = new MockAdapter(client);
const baseService = new BaseService<string>(client);

/*
* 检测 BaseService 异常
* 检查 patch 和 put 在不支持时返回值是否符合文档定义
* @author wfn
*/
describe('BaseService error flow test', () => {
  /*
  * 检测 BaseService 的 patch
  * 当不支持该操作时，应该 thrown error
  * @author wfn
  */
  it('Test error flow of BaseService patch', async () => {
    await expect(baseService.patch(0, 'test')).rejects.toThrow();
  })

  /*
  * 检测 BaseService 的 put
  * 当不支持该操作时，应该 thrown error
  * @author wfn
  */
  it('Test error flow of BaseService put', async () => {
    await expect(baseService.put(0, 'test')).rejects.toThrow();
  })
})

/*
* 检测 BaseService 正常
* 检查 patch 和 put 在支持时返回值是否符合文档定义
* @author wfn
*/
describe('BaseService normal flow test', () => {
  beforeAll(() => {
    mock.onPatch('/1').reply(config => {
      return [200, 'test']
    });
    mock.onPut('/1').reply(config => {
      return [200, 'test']
    });
  })

  /*
  * 检测 BaseService 的 patch
  * 当支持该操作时，应该返回我们挂载的值
  * @author wfn
  */
  it('Test normal flow of BaseService patch', async () => {
    await expect(baseService.patch(1, 'test')).resolves.toBeDefined();
  })

  /*
  * 检测 BaseService 的 put
  * 当支持该操作时，应该返回我们挂载的值
  * @author wfn
  */
  it('Test normal flow of BaseService put', async () => {
    await expect(baseService.put(1, 'test')).resolves.toBeDefined();
  })
})
