import {MaterialTableProps} from "material-table";
import {EntityService, IRequestFilterOptions} from "../services/ServiceInterfaces";

export interface IDataTableFilterOption {
  label: string;
  value: string | number;
}

export type optionFetcher = () => Promise<IDataTableFilterOption[]>;

export interface IDataTableFilterProps {
  name: string;
  placeholder?: string;
  optionFetcher?: optionFetcher;
}

export interface IDataTableFilterOutput {
  name: string;
  value: string | string[];
}

export type useFilterResult = [IDataTableFilterOutput | null, JSX.Element];

export interface _IDataTableProps<RowData extends object> extends MaterialTableProps<RowData> {
  filterOptions: IRequestFilterOptions<any>;
  dataSource: EntityService<RowData>;
}

export type IDataTableProps<RowData extends object> = Omit<_IDataTableProps<RowData>, 'data' | 'icons'>;
