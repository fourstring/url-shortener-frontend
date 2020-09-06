import {testAdapter, testAdminService} from "../mocks/testClient";
import {testLink} from "../mocks/testData";

/*
* 检测 AuthService
* 检查 AuthService 正确运行
* @author wfn
*/
describe('AdminService test', () => {
  /*
  * 检测 AdminService disable 成功返回值
  * disable 成功返回 link
  * @author wfn
  */
  it("Test normal flow of AdminService disable", async () => {
    const result = testLink
    result.disabled = !testLink.disabled
    testAdapter.onPatch('admin/links/1').reply(config => {
      return [200, result]
    });
    await expect(testAdminService.disable(1, false))
      .resolves.toEqual(result);
  });

  /*
  * 检测 AdminService disable 失败返回值
  * disable 错误返回404，应当返回0
  * @author wfn
  */
  it('Test fail flow of AuthService login', async () => {
    testAdapter.onPatch('admin/links/1').reply(config => {
      return [404]
    });
    await expect(testAdminService.disable(1, false))
      .resolves.toBeNull();
  })

  /*
  * 检测 AdminService disable 失败返回值
  * disable 错误返回500，应当直接抛出异常
  * @author wfn
  */
  it('Test fail flow of AuthService login', async () => {
    testAdapter.onPatch('admin/links/1').reply(config => {
      return [500]
    });
    await expect(testAdminService.disable(1, false)).rejects.toThrow();
  })
})