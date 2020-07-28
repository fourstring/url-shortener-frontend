import React from "react"
import {LinkDetailView} from "./LinkDetailView"
import {createMemoryHistory} from "history";
import {renderHook} from '@testing-library/react-hooks'
import {testAdapter, testPagedData, testLink} from '../mocks/testData'
import {Router as BasicRouter} from "react-router";
import {Router} from "../router/Router";
import {IRoute} from "../types/IRouter"
import { render } from "@testing-library/react";


describe("Test LinkDetailView", () => {
  it("should render view correctly", async () => {
    const history = createMemoryHistory({
      initialEntries: ['/links/1']
    });
    testAdapter.onGet('/linsk/1').reply(config => {
      return [200, testLink]
    });

    const routes: IRoute[] = [
      {
        path: '/links',
        subRoutes: [
          {
            path: '/:id',
            component: <LinkDetailView/>,
            metadata: {
              displayText: '短链接',
            }
          }
        ]
      }
    ];
    const {getByText} = render(
       <BasicRouter history={history}>
        <Router routes={routes}/>
      </BasicRouter>
    )
    // const {result, waitForNextUpdate} = renderHook(() => (
    //   <BasicRouter history={history}>
    //     <Router routes={routes}/>
    //   </BasicRouter>
    // ))
    // await waitForNextUpdate();


    // act(()=>{
    //     fireEvent.click(getByText("1button"));
    // })
    // expect(result("返回")).toBeInTheDocument();        
    // expect(getByText("删除")).toBeInTheDocument();

  })


})