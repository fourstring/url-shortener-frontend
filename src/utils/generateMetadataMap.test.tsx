import {IRoute} from "../types/IRouter";
import React from "react";
import {generateMetadataMap} from "./generateMetadataMap";


describe("Test generateMetadataMap function", () => {
  const TestComponent1 = () => <h1>1</h1>;
  it("should handle single-level route configuration correctly", () => {
    const routes: IRoute[] = [
      {
        path: '/',
        component: <TestComponent1/>,
        metadata: {
          displayText: 'Test1'
        }
      },
      {
        path: '/t1',
        component: <TestComponent1/>,
        metadata: {
          displayText: 'Test2'
        }
      },
      {
        path: '/t2',
        component: <TestComponent1/>,
        metadata: {
          displayText: 'Test3'
        }
      }
    ];
    const metadataMap = generateMetadataMap(routes);
    expect(metadataMap.get('/')).toEqual({
      displayText: 'Test1'
    });
    expect(metadataMap.get('/t1')).toEqual({
      displayText: 'Test2'
    });
    expect(metadataMap.get('/t2')).toEqual({
      displayText: 'Test3'
    });
  });

  it('should handle recursive configuration correctly', function () {
    const routes: IRoute[] = [
      {
        path: '/admin',
        subRoutes: [
          {
            path: '/users',
            subRoutes: [
              {
                path: '/:id',
                component: <TestComponent1/>,
                metadata: {
                  displayText: 'user'
                }
              },
              {
                path: '',
                component: <TestComponent1/>,
                metadata: {
                  displayText: 'users'
                }
              }
            ]
          },
          {
            path: '/links',
            component: <TestComponent1/>,
            metadata: {
              displayText: 'links'
            }
          }
        ]
      }
    ];
    const metadataMap = generateMetadataMap(routes);
    expect(metadataMap.get('/admin/users')).toEqual({
      displayText: 'users'
    });
    expect(metadataMap.get('/admin/users/:id')).toEqual({
      displayText: 'user'
    });
    expect(metadataMap.get('/admin/links')).toEqual({
      displayText: 'links'
    });
  });

  it('should handle mixed configuration correctly', function () {
    const routes: IRoute[] = [
      {
        path: '/',
        component: <TestComponent1/>,
        metadata: {
          displayText: 'Test1'
        }
      },
      {
        path: '/t1',
        component: <TestComponent1/>,
        metadata: {
          displayText: 'Test2'
        }
      },
      {
        path: '/t2',
        component: <TestComponent1/>,
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
                component: <TestComponent1/>,
                metadata: {
                  displayText: 'user'
                }
              },
              {
                path: '',
                component: <TestComponent1/>,
                metadata: {
                  displayText: 'users'
                }
              }
            ]
          },
          {
            path: '/links',
            component: <TestComponent1/>,
            metadata: {
              displayText: 'links'
            }
          }
        ]
      }
    ];
    const metadataMap = generateMetadataMap(routes);
    expect(metadataMap.get('/')).toEqual({
      displayText: 'Test1'
    });
    expect(metadataMap.get('/t1')).toEqual({
      displayText: 'Test2'
    });
    expect(metadataMap.get('/t2')).toEqual({
      displayText: 'Test3'
    });
    expect(metadataMap.get('/admin/users')).toEqual({
      displayText: 'users'
    });
    expect(metadataMap.get('/admin/users/:id')).toEqual({
      displayText: 'user'
    });
    expect(metadataMap.get('/admin/links')).toEqual({
      displayText: 'links'
    });
  });
});
