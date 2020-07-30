import React from "react"
import {LinksView} from "./LinksView"
import {act, fireEvent, render, waitFor} from "@testing-library/react";
import {testPagedData} from '../mocks/testData'
import {Adapter} from "../mocks/e2eClient";

  /*
  * 检测 LinksView 
  * 检测LinksView是否正常渲染内容
  * @author ydx
  */

describe("Test LinksView", () => {
  it("should render view correctly", async () => {
    Adapter.onGet('localhost:8080/links').reply(config => {
      return [200, testPagedData]
    });
    const {getByText} = render(
      <LinksView/>
    );
    await waitFor(() => {
    });

    expect(getByText("删除")).toBeInTheDocument();

    act(() => {
      fireEvent.click(getByText('删除'));
    })
  }),

  it("should render view when data is null", async () => {
    Adapter.onGet('/links').reply(config => {
      return [200, null]
    });
    const {getByText} = render(
      <LinksView/>
    );
    await waitFor(() => {
    });

    expect(getByText("您的短链接列表为空")).toBeInTheDocument();
  })
}

)