import {BaseService} from './BaseService'
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
<<<<<<< HEAD
import {linkDb} from "../mocks/mockDb";

/*
* 测试BaseService.get(id)
* 检查当正常get获得200时能否返回值
* @author lzl
*/
describe("Test normally get of BaseService",async()=>{
    let client = axios.create();
    let mock = new MockAdapter(client);
    mock.onGet('/1').reply(() => {return [200, 'test']});
    let baseService=new BaseService(client);

    it('Test normal flow',async ()=>{
        await expect(baseService.get(1)).resolves.toBeDefined();
    });
});

/*
* 测试BaseService.get(id)
* 检查当错误get获得500时能否正常抛出错误
* @author lzl
*/
describe("Test get of BaseService with error",async()=>{
    let client = axios.create();
    let mock = new MockAdapter(client);
    mock.onGet('/1').reply(() => {return [500, 'test']});
    let baseService=new BaseService(client);

    it('Test error flow',async ()=>{
        await expect(baseService.get(1)).rejects.toThrow();
    });
});

/*
* 测试BaseService.delete(id)
* 检查当正常delete获得200时能否返回值
* @author lzl
*/
describe("Test normally delete of BaseService",async()=>{
    let client = axios.create();
    let mock = new MockAdapter(client);
    mock.onDelete('/1').reply(() => {return [200, 'test']});
    let baseService=new BaseService(client);

    it('Test normal flow',async ()=>{
        await expect(baseService.delete(1)).resolves.toBeDefined();
    });
});

/*
* 测试BaseService.get(id)
* 检查当错误delete获得404时能否正常抛出错误
* @author lzl
*/
describe("Test delete of BaseService with error",async()=>{
    let client = axios.create();
    let mock = new MockAdapter(client);
    mock.onDelete('/1').reply(() => {return [404, 'test']});
    let baseService=new BaseService(client);

    it('Test error flow',async ()=>{
        await expect(baseService.delete(1)).rejects.toThrow();
    });
});

/*
* 测试BaseService.patch(id,data)
* 检查当正常patch获得200时能否返回值
* @author lzl
*/
describe("Test normally patch of BaseService",async()=>{
    let client = axios.create();
    let mock = new MockAdapter(client);
    mock.onPatch('/1').reply(() => {return [200, 'test']});
    let baseService=new BaseService(client);

    it('Test normal flow',async ()=>{
        await expect(baseService.patch(1,'test')).resolves.toBeDefined();
    })
});

/*
* 测试BaseService.patch(id,data)
* 检查当错误patch时能否正常抛出错误
* @author lzl
*/
describe("Test patch of BaseService with error",async()=>{
    let client = axios.create();
    let baseService=new BaseService(client);

    it('Test error flow',async ()=>{
        await expect(baseService.patch(1,'test')).rejects.toThrow();
    });
});

/*
* 测试BaseService.put(id,data)
* 检查当正常put获得200时能否返回值
* @author lzl
*/
describe("Test normally put of BaseService",async()=>{
    let client = axios.create();
    let mock = new MockAdapter(client);
    mock.onPut('/1').reply(() => {return [200, 'test']});
    let baseService=new BaseService(client);

    it('Test normal flow',async ()=>{
        await expect(baseService.put(1, 'test')).resolves.toBeDefined();
    })
});

/*
* 测试BaseService.put(id, data)
* 检查当错误put时能否正常抛出错误
* @author lzl
*/
describe("Test put of BaseService with error",async()=>{
    let client = axios.create();
    let baseService=new BaseService(client);

    it('Test error flow',async ()=>{
        await expect(baseService.put(1, 'test')).rejects.toThrow();
    });
});
=======

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
>>>>>>> dev
