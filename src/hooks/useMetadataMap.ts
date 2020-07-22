import {IRoute, IRouteMetadata} from "../types/IRouter";
import React from "react";
import {RoutesContext} from "../contexts/RoutesContext";
import {generateMetadataMap} from "../utils/generateMetadataMap";

export function useMetadataMap(): Map<string, IRouteMetadata> {
  const routes = React.useContext<IRoute[]>(RoutesContext);
  return React.useMemo<Map<string, IRouteMetadata>>(
    () => generateMetadataMap(routes), [routes]
  );
}
