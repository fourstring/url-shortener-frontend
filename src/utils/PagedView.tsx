import React, {useState} from "react";
import {BaseService} from "../services/BaseService";
import {IEntity} from "../types/IEntity";
import {Pagination} from "@material-ui/lab";
import {IRequestFilterOptions} from "../services/ServiceInterfaces";
import {useEntities} from "../hooks/useEntities";
import {CircularProgress} from "@material-ui/core";

export function PagedView<T extends IEntity, InputT = T>(props: React.PropsWithChildren<{
  dataSource: BaseService<T, InputT>,
  filter: Omit<Partial<IRequestFilterOptions<T>>, 'page'>,
  children: (data: Map<number, T>, paginator: JSX.Element) => any
}>) {
  const [page, setPage] = useState(1); // Pagination component is 1-indexed.
  const {entities, error, loading, count: pageInfo} = useEntities<T, InputT>(props.dataSource, {
    page: page,
    size:10,
    ...props.filter
  });
  const paginator = <Pagination showFirstButton
                                showLastButton
                                onChange={(event, page1) => setPage(page1)}
                                page={page}
                                variant="outlined"
                                shape="rounded"
                                count={pageInfo!==null?Math.ceil(pageInfo/10):0}
  />;
  return (
    <>
      {loading && <CircularProgress/>}
      {!loading && props.children(entities, paginator)}
    </>
  );
}