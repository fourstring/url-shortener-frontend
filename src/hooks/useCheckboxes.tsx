import React, {useEffect, useState} from "react"
import {IEntity} from "../types/IEntity";
import {Checkbox} from "@material-ui/core";
import {usePrevious} from "./usePrevious";
import _ from "lodash";

export function useCheckboxes<T extends IEntity>(data: T[]): {
  selected: number[],
  checkboxes: Map<number, JSX.Element>,
  select: (id: number) => void,
  clear: () => void
};

export function useCheckboxes<T extends IEntity>(data: Map<number, T>): {
  selected: number[],
  checkboxes: Map<number, JSX.Element>,
  select: (id: number) => void,
  clear: () => void
};

export function useCheckboxes<T extends IEntity>(data: T[] | Map<number, T>): {
  selected: number[],
  checkboxes: Map<number, JSX.Element>,
  select: (id: number) => void,
  clear: () => void
} {
  const [selectedMap, setSelectedMap] = useState<Map<number, boolean>>(new Map<number, boolean>());
  const [reRender, setReRender] = useState<boolean>(false);
  const previousData = usePrevious(data);

  useEffect(() => {
    if (!(previousData && _.isEqual(previousData, data))) {
      selectedMap.clear();
      data.forEach((value: T) => {
        selectedMap.set(value.id, false)
      });
      console.log(selectedMap);
      setReRender(prevState => !prevState);
    }
  });

  function select(id: number): void {
    if (selectedMap.has(id)) {
      selectedMap.set(id, !selectedMap.get(id));
      setReRender(prevState => !prevState);
    }
  }

  function clear() {
    selectedMap.clear();
    setReRender(prevState => !prevState);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    select(parseInt(event.target.name));
  }

  const checkboxes: Map<number, JSX.Element> = new Map<number, JSX.Element>();
  if (data instanceof Array) {
    data.forEach(value => checkboxes.set(value.id, <Checkbox checked={selectedMap.get(value.id) || false} key={value.id}
                                                             onChange={handleChange} name={value.id.toString()}/>));
  } else {
    for (const key of data.keys()) {
      checkboxes.set(key, <Checkbox checked={selectedMap.get(key) || false} key={key}
                                    onChange={handleChange} name={key.toString()}/>);
    }
  }
  let selected: number[] = [];
  for (const [key, value] of selectedMap.entries()) {
    if (value) {
      selected.push(key);
    }
  }
  return {
    selected,
    checkboxes,
    select,
    clear
  }
}

