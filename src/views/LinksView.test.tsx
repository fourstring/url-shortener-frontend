import React from "react"
import {LinksView} from "./LinksView"
import {act, fireEvent, render, waitFor} from "@testing-library/react";
import {testPagedData} from '../mocks/testData'
import {testAdapter, testClient} from "../mocks/testClient";
import {linkService} from "../services/LinkService";

linkService.client = testClient;
/*
* 检测 LinksView
* 检测LinksView是否正常渲染内容
* @author ydx
*/

describe("Test LinksView", () => {
    it("should render view correctly", async () => {
      testAdapter.onGet('/links').reply(config => {
        return [200, testPagedData]
      });
      testAdapter.onDelete(/\/links\/\d+/).reply(config => {
        return [204]
      })

      const {getByText} = render(
        <LinksView/>
      );
      await waitFor(() => {
      });

      expect(getByText("删除")).toBeInTheDocument();

      act(() => {
        fireEvent.click(getByText('删除'));
      })
    });

    it("should render view when data is empty", async () => {
      testAdapter.onGet('/links').reply(config => {
        return [200, {
          count: 0,
          result: []
        }]
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
