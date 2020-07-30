import {MutateMethods, useEntity, useEntityResult} from './useEntity';
import {act, renderHook} from '@testing-library/react-hooks'
import {testAdapter, testBaseService} from '../mocks/testClient'

function testResultBeforeUpdate(result: useEntityResult<string, string>) {
  expect(result.data).toBeNull();
  expect(result.loading).toBe(true);
  expect(result.error).toBeNull();
  expect(result.mutating).toBe(false);
}

function testResultAfterUpdate(result: useEntityResult<string, string>, data: string | null) {
  expect(result.data).toBe(data);
  expect(result.loading).toBe(false);
  expect(result.error).toBeNull();
  expect(result.mutating).toBe(false);
}

function testErrorAfterUpdate(result: useEntityResult<string, string>, data: string | null) {
  expect(result.data).toBe(data);
  expect(result.loading).toBe(false);
  expect(result.error).not.toBeNull();
  expect(result.mutating).toBe(false);
}

function actIssueMutate(result: useEntityResult<string, string>, method: MutateMethods, data: string = '', mutator?: any) {
  act(() => {
    result.issueMutate({
      id: 1,
      data: data,
      method: method,
      mutator: mutator
    })
  });
}

/*
* 检测 useEntity 设置状态
* 检测 useEntities 在请求成功和失败时是否正确设置状态，
* @author wfn
*/
describe('useEntity set state test', () => {
  /*
   * 检测 useEntity 在请求成功时是否正确设置状态，
   * 更新前 data 为空，loading 为 true, error为空， mutating为false
   * 更新后 data 设置成功，loading 结束, error为空， mutating为false
   * @author wfn
   */
  it('should correctly set data and update loading', async () => {
    testAdapter.onGet('/1').reply(config => {
      return [200, 'test']
    });
    const {result, waitForNextUpdate} = renderHook(() =>
      useEntity<string>(1, testBaseService)
    );
    testResultBeforeUpdate(result.current);
    await waitForNextUpdate();
    testResultAfterUpdate(result.current, 'test');
  })

  /*
   * 检测 useEntity 在请求失败时是否正确设置状态，
   * 更新前 data 为空，loading 为 true, error为空， mutating为false
   * 更新后 data 设置成功，loading 结束, 返回一个 error 并设置， mutating为false
   * @author wfn
   */
  it('should correctly set error if failed', async () => {
    testAdapter.onGet('/1').reply(config => {
      return [500]
    });
    const {result, waitForNextUpdate} = renderHook(() =>
      useEntity<string>(1, testBaseService)
    );
    testResultBeforeUpdate(result.current);
    await waitForNextUpdate();
    testErrorAfterUpdate(result.current, null);
  })
})

/*
 * 检测 useEntity issueMutate 设置状态
 * 检测 issueMutate PUT、PATCH方法是否执行正确
 * @author wfn
 */
describe('useEntity issueMutate test', () => {
  /*
   * 检测 issueMutate PATCH方法是否执行正确
   * 应当更新 data 为 patch
   * @author wfn
   */
  it('should correctly handle patch', async () => {
    testAdapter.onPatch('/1').reply(config => {
      return [200, 'patch']
    });
    let {result, waitForNextUpdate} = renderHook(() =>
      useEntity<string>(1, testBaseService)
    );
    await waitForNextUpdate();
    actIssueMutate(result.current, MutateMethods.PATCH);
    await waitForNextUpdate();
    testResultAfterUpdate(result.current, 'patch');
  })

  /*
   * 检测 issueMutate PUT 方法是否执行正确
   * 应当更新 data 为 put
   * @author wfn
   */
  it('should correctly handle put', async () => {
    testAdapter.onPut('/1').reply(config => {
      return [200, 'put']
    });
    let {result, waitForNextUpdate} = renderHook(() =>
      useEntity<string>(1, testBaseService)
    );
    await waitForNextUpdate();
    actIssueMutate(result.current, MutateMethods.PUT);
    await waitForNextUpdate();
    testResultAfterUpdate(result.current, 'put');
  })

  /*
   * 检测 issueMutate PATCH方法是否执行正确
   * 应当更新 data 为 patch
   * @author wfn
   */
  it('should correctly handle delete if success', async () => {
    let {result, waitForNextUpdate} = renderHook(() =>
      useEntity<string>(1, testBaseService)
    );
    await waitForNextUpdate();
    testAdapter.onDelete('/1').reply(config => {
      return [200, 'delete']
    });
    actIssueMutate(result.current, MutateMethods.DELETE);
    await waitForNextUpdate();
    testResultAfterUpdate(result.current, null);
  })
  /*
   * 检测 issueMutate DELETE 方法是否执行正确
   * data 应该没有被更新
   * @author wfn
   */
  it('should correctly handle delete if an error occur', async () => {
    testAdapter.onGet('/1').reply(config => {
      return [200, 'test']
    });
    let {result, waitForNextUpdate} = renderHook(() =>
      useEntity<string>(1, testBaseService)
    );
    await waitForNextUpdate();
    testAdapter.onDelete('/1').reply(config => {
      return [500]
    });
    actIssueMutate(result.current, MutateMethods.DELETE);
    await waitForNextUpdate();
    testErrorAfterUpdate(result.current, 'test');
  })
  /*
   * 检测 issueMutate 自定义 mutator 方法是否执行正确
   * 检测 mutator 函数被调用，其他检测已经在其他测试检测过，这里不做重复
   * @author wfn
   */
  it('should correctly handle self-defined mutator', async () => {
    testAdapter.onPatch('/1').reply(config => {
      return [200, 'post']
    });
    let {result} = renderHook(() =>
      useEntity<string>(1, testBaseService)
    );
    let func = jest.fn();
    actIssueMutate(result.current, MutateMethods.DELETE, '', func);
    expect(func).toBeCalledTimes(1);
  })
})
