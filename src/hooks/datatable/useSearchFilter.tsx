import React, {useState} from "react";
import {SearchBar} from "../../components/SearchBar";
import {IDataTableFilterOutput} from "../../types/IDataTable";

export function useSearchFilter(props: { name: string, placeholder: string }): [IDataTableFilterOutput, JSX.Element] {
  const [searchText, setSearchText] = useState('');

  return [{
    name: props.name,
    value: searchText
  }, (<SearchBar onChange={(event => setSearchText(event.target.value))}
                 searchText={`${props.placeholder}`} value={searchText}/>)]
}