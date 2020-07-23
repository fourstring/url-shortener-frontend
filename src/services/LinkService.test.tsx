import '@testing-library/jest-dom'
import { LinkService } from './LinkService'
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {IRequestFilterOptions} from "./ServiceInterfaces";
import {IPagedData} from "../types/IHAL";
import {ILink, ILinkInput} from "../types/ILink";
import {link} from "../mocks/mockDb"
let client = axios.create();
let mock = new MockAdapter(client);

/*
* 检测 LinkService get 返回值
* 检查 get 成功和异常时返回值是否符合文档定义
* @author ydx
*/
describe('LinkService get test',() => {
    /*
    * 检测 LinkService get 成功返回值
    * get 成功返回 200 并返回相应的 link 数据
    * @author ydx
    */
    it("Test normal flow of LinkService get",async ()=>{
        mock.onGet('/links/1').reply(config => {return [200, link]});
        let linkService = new LinkService(client);
        await expect(linkService.get(1)).resolves.toEqual(link);
    });

    /*
    * 检测 LinkService get 失败返回值
    * get 失败返回 404, 抛出异常
    * @author ydx
    */
    it("Test fail flow of LinkService get",async ()=>{
        mock.onGet('/links/1').reply(config => {return [404]});
        let linkService = new LinkService(client);
        await expect(linkService.get(1)).rejects.toThrow();
    });

    /*
    * 检测 LinkService get 异常返回值
    * get 异常时直接抛出异常
    * @author ydx
    */
    it('Test error flow of LinkService get', async () => {
        mock.onGet('/links/1').reply(config => {return [500]});
        let linkService = new LinkService(client);
        await expect(linkService.get(1)).rejects.toThrow();
    })
})

/*
* 检测 LinkService getAll 返回值
* 检查 getAll 成功和异常时返回值是否符合文档定义
* @author ydx
*/
describe('LinkService getAll test',() => {
    const request: IRequestFilterOptions<ILink> = {page: 1, size: 10, fields: []};
    const response: IPagedData<ILink> = {
        count: 1,
        results: [
            {
                id: 1,
                user: {
                    id: 0,
                    username: "string",
                    email: "user@example.com",
                },
                linkKey: "string",
                href: "string",
                createAt: "string",
                updateAt: "string"
            }
        ]
    }

    /*
    * 检测 LinkService getAll 成功返回值
    * getAll 成功返回 200 并返回相应的 link 数据
    * @author ydx
    */
    it("Test normal flow of LinkService getAll",async ()=>{
        mock.onGet('/links').reply(config => {return [200, response]});
        let linkService = new LinkService(client);
        await expect(linkService.getAll(request)).resolves.toEqual(response);
    });

    /*
    * 检测 LinkService getAll 异常返回值
    * getAll 异常时直接抛出异常
    * @author ydx
    */
    it('Test error flow of LinkService getAll', async () => {
        mock.onGet('/links').reply(config => {return [500]});
        let linkService = new LinkService(client);
        await expect(linkService.getAll(request)).rejects.toThrow();
    })
})

/*
* 检测 LinkService delete 返回值
* 检查 delete 成功和异常时返回值是否符合文档定义
* @author ydx
*/
describe('LinkService delete test',() => {
    /*
    * 检测 LinkService delete 成功返回值
    * delete 成功返回 200, 返回 true 表示删除成功
    * @author ydx
    */
    it("Test normal flow of LinkService delete",async ()=>{
        mock.onDelete('/links/1').reply(config => {return [200]});
        let linkService = new LinkService(client);
        await expect(linkService.delete(1)).resolves.toEqual(true);
    });

    /*
    * 检测 LinkService delete 失败返回值
    * delete 失败返回 404, 抛出异常
    * @author ydx
    */
    it("Test fail flow of LinkService delete",async ()=>{
        mock.onDelete('/links/1').reply(config => {return [404]});
        let linkService = new LinkService(client);
        await expect(linkService.delete(1)).rejects.toThrow();
    });

    /*
    * 检测 LinkService delete 异常返回值
    * delete 异常时直接抛出异常
    * @author ydx
    */
    it('Test error flow of LinkService delete', async () => {
        mock.onDelete('/links/1').reply(config => {return [500]});
        let linkService = new LinkService(client);
        await expect(linkService.delete(1)).rejects.toThrow();
    })
})

/*
* 检测 LinkService post 返回值
* 检查 post 成功、失败和异常时返回值是否符合文档定义
* @author ydx
*/
describe('LinkService post test',() => {
    const request: ILinkInput =  {
        user: 0,
    }
    /*
    * 检测 LinkService post 成功返回值
    * post 成功返回 200, 并返回相应的 link 数据
    * @author ydx
    */
    it("Test normal flow of LinkService post",async ()=>{
        mock.onPost('/links').reply(config => {return [200, link]});
        let linkService = new LinkService(client);
        await expect(linkService.post(request)).resolves.toEqual(link);
    });

    /*
    * 检测 LinkService post 失败返回值
    * post 失败返回 400, 抛出异常
    * @author ydx
    */
    it("Test fail flow of LinkService post",async ()=>{
        mock.onPost('/links').reply(config => {return [400]});
        let linkService = new LinkService(client);
        await expect(linkService.post(request)).rejects.toThrow();
    });

    /*
    * 检测 LinkService post 异常返回值
    * post 异常时直接抛出异常
    * @author ydx
    */
    it('Test error flow of LinkService post', async () => {
        mock.onPost('/links').reply(config => {return [500]});
        let linkService = new LinkService(client);
        await expect(linkService.post(request)).rejects.toThrow();
    })
})