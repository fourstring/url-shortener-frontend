import {EntitiesResult, useEntities} from './useEntities';
import {MutateMethods} from "./useEntity";
import {act, renderHook} from '@testing-library/react-hooks'
import {ILink, ILinkInput} from "../types/ILink";
import {
  testLink,
  testLinkList,
  testPagedData,
  testRequestFilterOptions
} from '../mocks/testData';
import {testAdapter, testLinkService} from '../mocks/testClient'

const mutatorData: ILink[] | Partial<ILinkInput>[] = [{user: 1, href: 'href'}]

function testResultBeforeUpdate(result: EntitiesResult<ILink, ILinkInput>) {
  expect(result.entities.size).toBe(0);
  expect(result.count).toBeNull();
  expect(result.loading).toBe(true);
  expect(result.error).toBeNull();
  expect(result.mutating).toBe(false);
}

function testResultAfterUpdate(result: EntitiesResult<ILink, ILinkInput>, data?: ILink[] | null, count?: number | null) {
  let map = new Map<number, ILink>();
  data?.forEach(link => map.set(link.id, link));
  count = (typeof count == 'undefined') ? null : count;
  expect(result.entities).toEqual(map);
  expect(result.count).toBe(count);
  expect(result.loading).toBe(false);
  expect(result.error).toBeNull();
  expect(result.mutating).toBe(false);
}

function testErrorAfterUpdate(result: EntitiesResult<ILink, ILinkInput>) {
  expect(result.entities.size).toBe(0);
  expect(result.loading).toBe(false);
  expect(result.error).not.toBeNull();
  expect(result.mutating).toBe(false);
}

function actIssueMutate(result: EntitiesResult<ILink, ILinkInput>, method: MutateMethods, data?: ILink[] | Partial<ILinkInput>[], mutator?: any) {
  act(() => {
    result.issueMutate({
      ids: [1],
      data: data ? data : mutatorData,
      method: method,
      mutator: mutator
    })
  });
}

/*
* 检测 useEntities set state
* useEntities 在获得数据和未获得数据时应该分别更新和设置错误
* @author wfn
*/
describe('useEntities correctly set state', () => {
  /*
  * 检测 useEntities 正常情况
  * useEntities 出错时应设置 error, 检查更新后 error 不为 null
  * @author wfn
  */
  it('should correctly set data and update loading', async () => {
    testAdapter.onGet('/links').reply(config => {
      return [200, testPagedData]
    });
    const {result, waitForNextUpdate} = renderHook(() =>
      useEntities<ILink, ILinkInput>(testLinkService, testRequestFilterOptions)
    )
    testResultBeforeUpdate(result.current);
    await waitForNextUpdate();
    testResultAfterUpdate(result.current, testLinkList, 10);
  })

  /*
  * 检测 useEntities 出错情况
  * useEntities 出错时应设置 error, 检查更新后 error 不为 null
  * @author wfn
  */
  it('should correctly set error if failed', async () => {
    testAdapter.onGet('/links').reply(config => {
      return [500]
    });
    const {result, waitForNextUpdate} = renderHook(() =>
      useEntities<ILink, ILinkInput>(testLinkService, testRequestFilterOptions)
    )
    await waitForNextUpdate();
    testErrorAfterUpdate(result.current);
  })
})

/*
 * 检测 useEntities issueMutate 设置状态
 * 检测 issueMutate PUT、PATCH、DELETE方法是否执行正确，返回值是否符合预期
 * 检测自定义
 * @author wfn
 */
it('useEntities issueMutate test', async () => {
  testAdapter.onPut('/links/1').reply(config => {
    return [200, testLink]
  });
  testAdapter.onDelete('/links/1').reply(config => {
    return [200, testLink]
  });
  testAdapter.onPatch('/links/1').reply(config => {
    return [200, testLink]
  });

  const {result, waitForNextUpdate} = renderHook(() =>
    useEntities<ILink, ILinkInput>(testLinkService, testRequestFilterOptions)
  )
  await waitForNextUpdate();

  actIssueMutate(result.current, MutateMethods.PATCH);
  await waitForNextUpdate();
  testResultAfterUpdate(result.current, testLinkList);

  actIssueMutate(result.current, MutateMethods.PUT);
  await waitForNextUpdate();
  testResultAfterUpdate(result.current, testLinkList);

  actIssueMutate(result.current, MutateMethods.DELETE);
  await waitForNextUpdate();
  testResultAfterUpdate(result.current);

  const func = jest.fn();
  actIssueMutate(result.current, MutateMethods.PUT, mutatorData, func);
  expect(func).toBeCalledTimes(1);
})
