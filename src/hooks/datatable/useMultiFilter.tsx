import React, {useState} from "react";
import {IDataTableFilterProps, optionFetcher, useFilterResult} from "../../types/IDataTable";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import {useFilterOptions} from "./useFilterOptions";

export function useMultiFilter(props: IDataTableFilterProps): useFilterResult {
  const [selectedOptions, setSelected] = useState<string[]>([]);
  const options = useFilterOptions(props.optionFetcher as optionFetcher);

  return [{
    name: props.name,
    value: selectedOptions
  }, (
    <FormControl style={{width: "100%"}}>
      <InputLabel id={`${props.name}-helper`}>{props.placeholder}</InputLabel>
      <Select
        labelId={`${props.name}-helper`}
        multiple
        value={selectedOptions}
        onChange={(event) => setSelected(event.target.value as string[])}
        variant={"outlined"}
        style={{width: "100%"}}
      >
        {options && options.map(option =>
          <MenuItem key={option.label} value={option.value.toString()}>
            {option.label}
          </MenuItem>
        )}
      </Select>
    </FormControl>
  )]
}
