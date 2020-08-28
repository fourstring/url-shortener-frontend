import {renderHook} from '@testing-library/react-hooks'
import {useSearchFilter} from "./useSearchFilter";
import {fireEvent, render, waitFor} from "@testing-library/react";

/*
* 检测 useSearchFilter
* 检测 useSearchFilter 正确设置，正确渲染 searchBar
* @author wfn
*/
describe('useSearchFilter test', () => {
  it('should render components correctly', async () => {
    const {result} = renderHook(() => useSearchFilter({
      name: '内容',
      placeholder: '内容'
    }))
    const [search, filter] = result.current;
    expect(search.name).toBe('内容');
    // render hooks 构造出的 searchBar
    const {getByPlaceholderText} = render(filter);
    await waitFor(() => {
      expect(getByPlaceholderText("搜索内容...")).toBeInTheDocument();
      fireEvent.change(getByPlaceholderText("搜索内容..."), {
        target: {value: 'value'}
      })
    })
  })
})