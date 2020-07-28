import React from "react";
import {testLink} from "../mocks/testData"
import {fireEvent, render, act} from "@testing-library/react";
import {Router as BasicRouter} from "react-router";
import {createMemoryHistory} from "history";
import {LinkDetail} from "./LinkDetail"
import {MutateMethods, useEntity, useEntityResult} from '../hooks/useEntity';
import {testAdapter, testBaseService} from '../mocks/testData';

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

describe("LinkDetail test", ()=>{

    it("should render component correctly and return to the list correctly", async()=>{
        const history = createMemoryHistory({
            initialEntries: ['/links/1']
        });
    
        const {getByText} = render(
            <BasicRouter history={history}>
              <LinkDetail link={testLink}/>
            </BasicRouter>
        );
        expect(getByText("返回")).toBeInTheDocument();        
        expect(getByText("删除")).toBeInTheDocument();

        act(()=>{
            fireEvent.click(getByText("返回"))
        })

        expect(history.location.pathname).toBe("/links");

    });

    it("should render component correctly and delete the link correctly", async()=>{
        const history = createMemoryHistory({
            initialEntries: ['/links/1']
        });
    
        const {getByText} = render(
            <BasicRouter history={history}>
              <LinkDetail link={testLink}/>
            </BasicRouter>
        );
        act(()=>{
            fireEvent.click(getByText("删除"))
        })
        
    })
})