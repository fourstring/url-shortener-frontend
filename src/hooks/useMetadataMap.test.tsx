import React from "react";
import {render} from "@testing-library/react";
import {Router as BasicRouter} from 'react-router-dom';
import {createMemoryHistory, MemoryHistory} from 'history';
import {IRoute} from "../types/IRouter";
import {useMetadataMap} from "./useMetadataMap";
import {Router} from "../router/Router";

describe("Test useMetadataMap can generate correct metadataMap or not", () => {
  let history: MemoryHistory;
  const TestComponent1 = (props: { value: number }) => <h1>{props.value}</h1>;
  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/']
    });
  });

  it('should return correct metadataMap from Router', function () {
    const DisplayAllMetadataComponent = () => {
      const metadataMap = useMetadataMap();
      const headings = [];
      for (let metadata of metadataMap.values()) {
        headings.push(<h1>{metadata.displayText}</h1>)
      }
      return (
        <>
          {headings}
        </>
      )
    };
    const routes: IRoute[] = [
      {
        path: '/t1',
        component: <TestComponent1 value={2}/>,
        metadata: {
          displayText: 'Test2'
        }
      },
      {
        path: '/t2',
        component: <TestComponent1 value={3}/>,
        metadata: {
          displayText: 'Test3'
        }
      },
      {
        path: '/',
        component: <DisplayAllMetadataComponent/>,
        metadata: {
          displayText: 'Test1'
        }
      }
    ];

    const {getByText} = render(<BasicRouter history={history}>
      <Router routes={routes}/>
    </BasicRouter>);
    expect(getByText(/Test1/i)).toBeInTheDocument();
    expect(getByText(/Test2/i)).toBeInTheDocument();
    expect(getByText(/Test3/i)).toBeInTheDocument();
  });
})
