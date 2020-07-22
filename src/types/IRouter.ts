import React from "react";

export interface IRouteMetadata {
  displayText?: string;
  displayIcon?: React.ReactNode;
  anonymousOnly?: boolean;
  authenticatedOnly?: boolean;
  adminOnly?: boolean;
}

export interface IRoute {
  path: string;
  component?: React.ReactNode;
  subRoutes?: IRoute[];
  metadata?: IRouteMetadata;
}

export interface IRouterProps {
  routes: IRoute[];
}
