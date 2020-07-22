import {useMetadataMap} from "./useMetadataMap";
import {useRouteMatch} from "react-router-dom";
import {IRouteMetadata} from "../types/IRouter";

export function useRouteMetadata(): IRouteMetadata {
  const metadataMap = useMetadataMap();
  const match = useRouteMatch();
  return metadataMap.get(match.path) as IRouteMetadata;
}
