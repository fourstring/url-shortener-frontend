import React from "react";
import {act, render} from "@testing-library/react";
import {Router as BasicRouter} from 'react-router-dom';
import {createMemoryHistory, MemoryHistory} from 'history';
import {IRoute} from "../types/IRouter";
import {Router} from "../router/Router";
import {useRouteMetadata} from "./useRouteMetadata";

describe("Test useRouteMetadata can return metadata of current route correctly", () => {
  let history: MemoryHistory;
  const DisplayMetadataComponent = () => {
    const metadata = useRouteMetadata();
    return (
      <h1>{metadata.displayText}</h1>
    )
  };
  beforeEach(() => {
    history = createMemoryHistory({
      initialEntries: ['/']
    });
  });

  it('should return correct metadata for current route', function () {
    const routes: IRoute[] = [
      {
        path: '/links',
        subRoutes: [
          {
            path: '/:id',
            component: <DisplayMetadataComponent/>,
            metadata: {
              displayText: 'Link'
            }
          }
        ]
      },
      {
        path: '/',
        component: <DisplayMetadataComponent/>,
        metadata: {
          displayText: 'Home'
        }
      }
    ];

    const {getByText} = render(<BasicRouter history={history}>
      <Router routes={routes}/>
    </BasicRouter>);
    expect(getByText(/Home/i)).toBeInTheDocument();
    act(() => {
      history.push('/links/1');
    });
    expect(getByText(/Link/i)).toBeInTheDocument();
  });
})
