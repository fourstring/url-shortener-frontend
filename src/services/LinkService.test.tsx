import '@testing-library/jest-dom'
import {iLink, iLinkInput, iPagedData, iRequestFilterOptions, linkService, mock} from "../mocks/mockClient";

/*
* 检测 LinkService get 返回值
* 检查 get 成功和异常时返回值是否符合文档定义
* @author wfn
*/
describe('LinkService get test', () => {
  /*
  * 检测 LinkService get 成功返回值
  * get 成功返回 200 并返回相应的 link 数据
  * @author wfn
  */
  it("Test normal flow of LinkService get", async () => {
    mock.onGet('/links/1').reply(config => {
      return [200, iLink]
    });
    await expect(linkService.get(1)).resolves.toEqual(iLink);
  });

  /*
  * 检测 LinkService get 失败返回值
  * get 失败返回 404, 抛出异常
  * @author wfn
  */
  it("Test fail flow of LinkService get", async () => {
    mock.onGet('/links/1').reply(config => {
      return [404]
    });
    await expect(linkService.get(1)).rejects.toThrow();
  });

  /*
  * 检测 LinkService get 异常返回值
  * get 异常时直接抛出异常
  * @author wfn
  */
  it('Test error flow of LinkService get', async () => {
    mock.onGet('/links/1').reply(config => {
      return [500]
    });
    await expect(linkService.get(1)).rejects.toThrow();
  })
})

/*
* 检测 LinkService getAll 返回值
* 检查 getAll 成功和异常时返回值是否符合文档定义
* @author wfn
*/
describe('LinkService getAll test', () => {
  /*
  * 检测 LinkService getAll 成功返回值
  * getAll 成功返回 200 并返回相应的 link 数据
  * @author wfn
  */
  it("Test normal flow of LinkService getAll", async () => {
    mock.onGet('/links').reply(config => {
      return [200, iPagedData]
    });
    await expect(linkService.getAll(iRequestFilterOptions)).resolves.toEqual(iPagedData);
  });

  /*
  * 检测 LinkService getAll 异常返回值
  * getAll 异常时直接抛出异常
  * @author wfn
  */
  it('Test error flow of LinkService getAll', async () => {
    mock.onGet('/links').reply(config => {
      return [500]
    });
    await expect(linkService.getAll(iRequestFilterOptions)).rejects.toThrow();
  })
})

/*
* 检测 LinkService delete 返回值
* 检查 delete 成功和异常时返回值是否符合文档定义
* @author wfn
*/
describe('LinkService delete test', () => {
  /*
  * 检测 LinkService delete 成功返回值
  * delete 成功返回 200, 返回 true 表示删除成功
  * @author wfn
  */
  it("Test normal flow of LinkService delete", async () => {
    mock.onDelete('/links/1').reply(config => {
      return [200]
    });
    await expect(linkService.delete(1)).resolves.toEqual(true);
  });

  /*
  * 检测 LinkService delete 失败返回值
  * delete 失败返回 404, 抛出异常
  * @author wfn
  */
  it("Test fail flow of LinkService delete", async () => {
    mock.onDelete('/links/1').reply(config => {
      return [404]
    });
    await expect(linkService.delete(1)).rejects.toThrow();
  });

  /*
  * 检测 LinkService delete 异常返回值
  * delete 异常时直接抛出异常
  * @author wfn
  */
  it('Test error flow of LinkService delete', async () => {
    mock.onDelete('/links/1').reply(config => {
      return [500]
    });
    await expect(linkService.delete(1)).rejects.toThrow();
  })
})

/*
* 检测 LinkService post 返回值
* 检查 post 成功、失败和异常时返回值是否符合文档定义
* @author wfn
*/
describe('LinkService post test', () => {
  /*
  * 检测 LinkService post 成功返回值
  * post 成功返回 200, 并返回相应的 link 数据
  * @author wfn
  */
  it("Test normal flow of LinkService post", async () => {
    mock.onPost('/links').reply(config => {
      return [200, iLink]
    });
    await expect(linkService.post(iLinkInput)).resolves.toEqual(iLink);
  });

  /*
  * 检测 LinkService post 失败返回值
  * post 失败返回 400, 抛出异常
  * @author wfn
  */
  it("Test fail flow of LinkService post", async () => {
    mock.onPost('/links').reply(config => {
      return [400]
    });
    await expect(linkService.post(iLinkInput)).rejects.toThrow();
  });

  /*
  * 检测 LinkService post 异常返回值
  * post 异常时直接抛出异常
  * @author wfn
  */
  it('Test error flow of LinkService post', async () => {
    mock.onPost('/links').reply(config => {
      return [500]
    });
    await expect(linkService.post(iLinkInput)).rejects.toThrow();
  })
})