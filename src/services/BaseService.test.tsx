import {BaseService} from './BaseService'
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

let client = axios.create();
let mock = new MockAdapter(client);
const baseService = new BaseService<string>(client);

/*
* BaseService
* 测试内容： patch 和 put 在支持时返回值
* @author ydx
*/
describe('BaseService normal flow test', ()=>{
    beforeAll(()=>{
        mock.onPatch('/1').reply(config => {return [200, 'test']});
        mock.onPut('/1').reply(config => {return [200, 'test']});
    })

    /*
    * patch
    * 正确结果：返回挂载的值
    * @author ydx
    */
    it('Test normal flow of BaseService patch',async ()=>{
        await expect(baseService.patch(1,'test')).resolves.toBeDefined();
    })

    /*
    *  put
    * 正确结果：返回挂载的值
    * @author ydx
    */
    it('Test normal flow of BaseService put',async ()=>{
        await expect(baseService.put(1,'test')).resolves.toBeDefined();
    })
})

/*
* BaseService 异常
* 测试内容：patch 和 put 在不支持时返回值
* @author ydx
*/
describe('BaseService error flow test', ()=>{
    /*
    * patch
    * 正确结果：thrown error
    * @author ydx
    */
    it('Test error flow of BaseService patch',async ()=>{
        await expect(baseService.patch(0,'test')).rejects.toThrow();
    })

    /*
    * put
    * 正确结果：thrown error
    * @author ydx
    */
    it('Test error flow of BaseService put',async ()=>{
        await expect(baseService.put(0,'test')).rejects.toThrow();
    })
})

