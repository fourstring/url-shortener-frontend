import {IRoute} from "../types/IRouter";
import React from "react";
import {Router} from "./Router";
import {Router as BasicRouter,} from "react-router-dom";
import {createMemoryHistory} from "history";
import {act, render} from "@testing-library/react";

describe("Test Router rendering behavior", () => {
  const TestComponent1 = (props: { value: number }) => <h1>{props.value}</h1>;
  it('should render single-level configuration correctly', function () {
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
        component: <TestComponent1 value={1}/>,
        metadata: {
          displayText: 'Test1'
        }
      }
    ];
    const history = createMemoryHistory({
      initialEntries: ['/']
    });
    const {getByText} = render(<BasicRouter history={history}>
      <Router routes={routes}/>
    </BasicRouter>);
    expect(getByText(/1/i)).toBeInTheDocument();
    act(() => {
      history.push('/t1');
    });
    expect(getByText(/2/i)).toBeInTheDocument();
    act(() => {
      history.push('/t2');
    });
    expect(getByText(/3/i)).toBeInTheDocument();
  });

  it('should render recursive configuration correctly', function () {
    const routes: IRoute[] = [
      {
        path: '/admin',
        subRoutes: [
          {
            path: '/users',
            subRoutes: [
              {
                path: '/:id',
                component: <TestComponent1 value={1}/>,
                metadata: {
                  displayText: 'user'
                }
              },
              {
                path: '',
                component: <TestComponent1 value={2}/>,
                metadata: {
                  displayText: 'users'
                }
              }
            ]
          },
          {
            path: '/links',
            component: <TestComponent1 value={3}/>,
            metadata: {
              displayText: 'links'
            }
          }
        ]
      }
    ];
    const history = createMemoryHistory({
      initialEntries: ['/admin/users/1']
    });
    const {getByText} = render(<BasicRouter history={history}>
      <Router routes={routes}/>
    </BasicRouter>);
    expect(getByText(/1/i)).toBeInTheDocument();
    act(() => {
      history.push('/admin/users');
    });
    expect(getByText(/2/i)).toBeInTheDocument();
    act(() => {
      history.push('/admin/links');
    });
    expect(getByText(/3/i)).toBeInTheDocument();
  });

  it('should render mixed configuration correctly', function () {
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
        path: '/admin',
        subRoutes: [
          {
            path: '/users',
            subRoutes: [
              {
                path: '/:id',
                component: <TestComponent1 value={4}/>,
                metadata: {
                  displayText: 'user'
                }
              },
              {
                path: '',
                component: <TestComponent1 value={5}/>,
                metadata: {
                  displayText: 'users'
                }
              }
            ]
          },
          {
            path: '/links',
            component: <TestComponent1 value={6}/>,
            metadata: {
              displayText: 'links'
            }
          }
        ]
      },
      {
        path: '/',
        component: <TestComponent1 value={1}/>,
        metadata: {
          displayText: 'Test1'
        }
      }
    ];
    const history = createMemoryHistory({
      initialEntries: ['/']
    });
    const {getByText} = render(<BasicRouter history={history}>
      <Router routes={routes}/>
    </BasicRouter>);
    expect(getByText(/1/i)).toBeInTheDocument();
    act(() => {
      history.push('/t1');
    });
    expect(getByText(/2/i)).toBeInTheDocument();
    act(() => {
      history.push('/t2');
    });
    expect(getByText(/3/i)).toBeInTheDocument();
    act(() => {
      history.push('/admin/users/1');
    });
    expect(getByText(/4/i)).toBeInTheDocument();
    act(() => {
      history.push('/admin/users');
    });
    expect(getByText(/5/i)).toBeInTheDocument();
    act(() => {
      history.push('/admin/links');
    });
    expect(getByText(/6/i)).toBeInTheDocument();
  });
});
