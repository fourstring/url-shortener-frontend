import React from "react"
import {LinksView} from "./LinksView"
import {createMemoryHistory} from "history";
import {render} from "@testing-library/react";
import {testPagedData} from '../mocks/testData'
import {Adapter} from "../mocks/e2eClient";

describe("Test LinksView", () => {
  it("should render view correctly", async () => {
    const history = createMemoryHistory({
      initialEntries: ['/links']
    });
    Adapter.onGet('/links').reply(config => {
      return [200, testPagedData]
    });
    const {getByText} = render(
      <LinksView/>
    );
  })


})