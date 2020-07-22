import {useEntityResult,useEntity,MutateMethods} from "./useEntity"
import {baseService,mock} from '../mocks/mockClient'
import '@testing-library/jest-dom'
import {act, renderHook} from '@testing-library/react-hooks'

function actIssueMutate(result: useEntityResult<string,string>, method: MutateMethods, data: string = '', mutator?: any){
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
* 测试 useEntity 设置状态
* 测试内容： useEntities 在请求成功和失败时的设置状态
* @author ydx
*/
describe ("useEntity state test",() => {

    /*
     * 1. useEntity 请求成功
     * 正确结果：
     * 更新前 data 为空，loading 为 true, error为空， mutating为false
     * 更新后 data 设置成功，loading 为 false, error为空， mutating为false
     * @author ydx
     */
    it('should correctly set data and update loading', async () => {
        mock.onGet('/1').reply(config => {return [200, 'test']});
        const { result, waitForNextUpdate } = renderHook(() =>
            useEntity<string>(1, baseService)
        );
        expect(result.current.data).toBeNull();
        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeNull();
        expect(result.current.mutating).toBe(false);
        await waitForNextUpdate();
        expect(result.current.data).toBe('test');
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.mutating).toBe(false);
    })

    /*
     * 1. useEntity 请求失败
     * 正确结果：
     * 更新前 data 为空，loading 为 true,  error为空， mutating为false
     * 更新后 data 为空，loading 为 false, error设置， mutating为false
     * @author ydx
     */

    it('should correctly set error when it failed', async () => {
        mock.onGet('/1').reply(config => {return [500]});
        const { result, waitForNextUpdate } = renderHook(() =>
            useEntity<string>(1, baseService)
        );
        expect(result.current.data).toBeNull();
        expect(result.current.loading).toBe(true);
        expect(result.current.error).toBeNull();
        expect(result.current.mutating).toBe(false);
        await waitForNextUpdate();
        expect(result.current.data).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.mutating).toBe(false);
    })

})

/*
* 测试 isssueMutate 设置状态
* 测试内容： issueMutate 在请求成功和失败时的设置状态
* @author ydx
*/
describe('issueMutate setting test', () =>{
    /*
     * 1.patch设置状态
     * 检查issueMutate设置的data
     * @author ydx
     */
    it('should correctly handle patch', async () => {
        mock.onPatch('/1').reply(() => {return [200, 'test']});
        let { result, waitForNextUpdate } = renderHook(() =>
            useEntity<string>(1, baseService)
        );
        actIssueMutate(result.current, MutateMethods.PATCH);
        await waitForNextUpdate();
        expect(result.current.data).toBe('test');
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.mutating).toBe(false);
    });

    /*
     * 2.put设置状态
     * 检查issueMutate设置的data
     * @author ydx
     */
    it('should correctly handle put', async () => {
        mock.onPut('/1').reply(() => {return [200, 'test']});
        let { result, waitForNextUpdate } = renderHook(() =>
            useEntity<string>(1, baseService)
        );
        actIssueMutate(result.current, MutateMethods.PUT);
        await waitForNextUpdate();
        expect(result.current.data).toBe('test');
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.mutating).toBe(false);
    });

    /*
     * 3.delete设置状态
     * 检查issueMutate设置的data
     * @author ydx
     */
    it('should correctly handle delete if success',async () => {
        let { result, waitForNextUpdate } = renderHook(() =>
            useEntity<string>(1, baseService)
        );
        await waitForNextUpdate();
        mock.onDelete('/1').reply(() => {return [200,'test']});
        actIssueMutate(result.current, MutateMethods.DELETE);
        await waitForNextUpdate();
        expect(result.current.data).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.mutating).toBe(false);
    });
});