import {IRoute, IRouteMetadata} from "../types/IRouter";

function _generateMetadataMap(routes: IRoute[], prefix: string, map: Map<string, IRouteMetadata>) {
  for (const route of routes) {
    if (route.subRoutes) {
      _generateMetadataMap(route.subRoutes, prefix + route.path, map);
    } else {
      map.set(prefix + route.path, route.metadata as IRouteMetadata);
    }
  }
}

export function generateMetadataMap(routes: IRoute[]): Map<string, IRouteMetadata> {
  const metadataMap = new Map<string, IRouteMetadata>();
  _generateMetadataMap(routes, '', metadataMap);
  return metadataMap;
}
