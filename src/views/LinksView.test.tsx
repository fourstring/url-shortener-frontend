import React from "react"
import {LinksView} from "./LinksView"
import {act, fireEvent, render, waitFor} from "@testing-library/react";
import {testPagedData} from '../mocks/testData'
import {Adapter} from "../mocks/e2eClient";

describe("Test LinksView", () => {
  it("should render view correctly", async () => {
    Adapter.onGet('/links').reply(config => {
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
  })
})