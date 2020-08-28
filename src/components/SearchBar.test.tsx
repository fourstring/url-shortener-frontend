import React from "react";
import {fireEvent, render, waitFor} from "@testing-library/react";
import {SearchBar} from "./SearchBar";

/*
* 检测 SearchBar
* 检测 SearchBar 正确渲染，当输入内容时正确调用 onChange 函数
* @author wfn
*/
describe('SearchBar test', () => {
  it('should render components correctly', async () => {
    const mockFunc = jest.fn();
    const {getByPlaceholderText} = render(
      <SearchBar onChange={mockFunc} searchText={"内容"}/>);
    await waitFor(()=>{
      expect(getByPlaceholderText("搜索内容...")).toBeInTheDocument();
      fireEvent.change(getByPlaceholderText("搜索内容..."), {
        target: {value: 'value'}
      })
      expect(mockFunc).toBeCalled();
    })
  })
})