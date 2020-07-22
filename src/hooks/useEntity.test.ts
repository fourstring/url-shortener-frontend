import {MutateMethods, useEntity, useEntityResult} from './useEntity';
import '@testing-library/jest-dom'
import {renderHook, act} from '@testing-library/react-hooks'
import { waitFor } from "@testing-library/dom";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import 'jest-localstorage-mock';
import {BaseService} from "../services/BaseService";

let client = axios.create();
let mock = new MockAdapter(client);
const baseService = new BaseService<string>(client);

function issueMutateAct(result: useEntityResult<string,string>, method: MutateMethods, data: string = '', mutator?: any){
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
* 测试useEntity设置状态
* 检查useEntity设置的状态是否满足文档定义
* @author lzl
*/
describe('useEntity setting test', () => {
    /*
     * 测试useEntity请求成功设置状态
     * 检查get跟新请求成功时设置的状态
     * @author lzl
     */
    it('test normal flow', async () => {

        mock.onGet('/1').reply(() => {return [200, 'test']});
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
    });

    /*
     * 测试useEntity请求失败设置状态
     * 检查get跟新请求失败时设置的状态
     * @author lzl
     */
    it('test fail flow', async() => {
        mock.onGet('/1').reply(() => {return [500]});
        const {result, waitForNextUpdate} = renderHook(() =>
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
});

/*
 * 测试issueMutate设置状态
 * 检查issueMutate设置的状态是否满足文档定义
 * @author lzl
 */
describe('issueMutate setting test', () =>{
    /*
     * 测试issueMutate的patch设置状态
     * 检查issueMutate设置的data
     * @author lzl
     */
    it('should correctly handle patch', async () => {
        mock.onPatch('/1').reply(() => {return [200, 'test']});
        let { result, waitForNextUpdate } = renderHook(() =>
            useEntity<string>(1, baseService)
        );
        issueMutateAct(result.current, MutateMethods.PATCH);
        await waitForNextUpdate();
        expect(result.current.data).toBe('test');
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.mutating).toBe(false);
    });

    /*
     * 测试issueMutate的put设置状态
     * 检查issueMutate设置的data
     * @author lzl
     */
    it('should correctly handle put', async () => {
        mock.onPut('/1').reply(() => {return [200, 'test']});
        let { result, waitForNextUpdate } = renderHook(() =>
            useEntity<string>(1, baseService)
        );
        issueMutateAct(result.current, MutateMethods.PUT);
        await waitForNextUpdate();
        expect(result.current.data).toBe('test');
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.mutating).toBe(false);
    });

    /*
     * 测试issueMutate的delete设置状态
     * 检查issueMutate设置的data
     * @author lzl
     */
    it('should correctly handle delete if success',async () => {
        let { result, waitForNextUpdate } = renderHook(() =>
            useEntity<string>(1, baseService)
        );
        await waitForNextUpdate();
        mock.onDelete('/1').reply(() => {return [200,'test']});
        issueMutateAct(result.current, MutateMethods.DELETE);
        await waitForNextUpdate();
        expect(result.current.data).toBe(null);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.mutating).toBe(false);
    });
});
