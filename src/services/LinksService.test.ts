import '@testing-library/jest-dom'
import { LinkService } from './LinksService'
import axios from "axios";
import {IPagedData} from "./ServiceInterfaces";
import {ILink} from "../types/ILink";
import {linkDb} from "../mocks/mockDb";
import MockAdapter from "axios-mock-adapter";
import {IRequestFilterOptions} from "./ServiceInterfaces";


/*
* 测试LinkService.get(id)
* 检查当正常get获得200时能否正确获取值
* @author lzl
*/
describe('Test normally get of BaseService',() => {
    let client = axios.create();
    let mock = new MockAdapter(client);
    mock.onGet('/links/0').reply(() => {
        return [200, linkDb.get(0)]
    });
    let linkService = new LinkService(client);
    it('Test normal flow', async () => {
        await expect(linkService.get(0)).resolves.toEqual(linkDb.get(0));
    });
});

/*
* 测试LinkService.get(id)
* 检查当get失败获得404时能否抛出异常
* @author lzl
*/
describe('Test fail get of BaseService',() => {
    let client = axios.create();
    let mock = new MockAdapter(client);
    mock.onGet('/links/0').reply(() => {
        return [404]
    });
    let linkService = new LinkService(client);
    it('Test fail flow', async () => {
        await expect(linkService.get(0)).rejects.toThrow();
    });
});

/*
* 测试LinkService.get(id)
* 检查当get异常直接抛出error
* @author lzl
*/
describe('Test error get of BaseService',() => {
    let client = axios.create();
    let mock = new MockAdapter(client);
    let linkService = new LinkService(client);
    it('Test error flow', async () => {
        await expect(linkService.get(0)).rejects.toThrow();
    });
});

/*
* 测试LinkService.delete(id)
* 检查当正常delete获得200时能否正确获取值
* @author lzl
*/
describe('Test normally delete of BaseService',() => {
    let client = axios.create();
    let mock = new MockAdapter(client);
    mock.onDelete('/links/0').reply(() => {return [200]});
    let linkService = new LinkService(client);
    it('Test normal flow', async () => {
        await expect(linkService.delete(0)).resolves.toEqual(true);
    });
});

/*
* 测试LinkService.delete(id)
* 检查当delete失败获得404时能否抛出异常
* @author lzl
*/
describe('Test fail delete of BaseService',() => {
    let client = axios.create();
    let mock = new MockAdapter(client);
    mock.onDelete('/links/0').reply(() => {
        return [404]
    });
    let linkService = new LinkService(client);
    it('Test fail flow', async () => {
        await expect(linkService.delete(0)).rejects.toThrow();
    });
});

/*
* 测试LinkService.delete(id)
* 检查当delete异常直接抛出error
* @author lzl
*/
describe('Test error delete of BaseService',() => {
    let client = axios.create();
    let mock = new MockAdapter(client);
    let linkService = new LinkService(client);
    it('Test error flow', async () => {
        await expect(linkService.delete(0)).rejects.toThrow();
    });
});

//定义变量
let getAllRequest: IRequestFilterOptions<ILink> = {page: 1, size: 10, fields: []};
let getAllResponse: IPagedData<ILink> = {
    count: 1,
    results: [
        {
            id: 1,
            user: {
                id: 0,
                username: "test",
                email: "test@example.com",
            },
            linkKey: "test",
            href: "test",
            createAt: "test",
            updateAt: "test"
        }
    ]
};

/*
* 测试LinkService.getAll(id)
* 检查当正常getAll获得200时能否正确获取值
* @author lzl
*/
describe('Test normally getAll of BaseService',() => {
    let client = axios.create();
    let mock = new MockAdapter(client);
    mock.onGet('/links').reply(() => {return [200, getAllResponse]});
    let linkService = new LinkService(client);
    it('Test normal flow', async () => {
        await expect(linkService.getAll(getAllRequest)).resolves.toEqual(getAllResponse);
    });
});

/*
* 测试LinkService.getAll(id)
* 检查当getAll异常直接抛出error
* @author lzl
*/
describe('Test error getAll of BaseService',() => {
    let client = axios.create();
    let mock = new MockAdapter(client);
    let linkService = new LinkService(client);
    it('Test error flow', async () => {
        await expect(linkService.get(1)).rejects.toThrow();
    });
});

let postRequest =  {
    user: 0,
    href: "string"
}

/*
* 测试LinkService.post(data)
* 检查当正常post获得200时能否正确获取值
* @author lzl
*/
describe('Test normally get of BaseService',() => {
    let client = axios.create();
    let mock = new MockAdapter(client);
    mock.onPost('/links').reply(() => {return [200, linkDb.get(0)]});
    let linkService = new LinkService(client);
    it('Test normal flow', async () => {
        await expect(linkService.post(postRequest)).resolves.toEqual(linkDb.get(0));
    });
});

/*
* 测试LinkService.post(data)
* 检查当post失败获得400时能否抛出异常
* @author lzl
*/
describe('Test fail post of BaseService',() => {
    let client = axios.create();
    let mock = new MockAdapter(client);
    mock.onPost('/links').reply(() => {return [400]});
    let linkService = new LinkService(client);
    it('Test fail flow', async () => {
        await expect(linkService.post(postRequest)).rejects.toThrow();
    });
});

/*
* 测试LinkService.post(data)
* 检查当post异常直接抛出error
* @author lzl
*/
describe('Test error post of BaseService',() => {
    let client = axios.create();
    let mock = new MockAdapter(client);
    let linkService = new LinkService(client);
    it('Test error flow', async () => {
        await expect(linkService.post(postRequest)).rejects.toThrow();
    });
});
