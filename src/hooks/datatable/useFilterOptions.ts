import {useEffect, useState} from "react";
import {IDataTableFilterOption} from "../../types/IDataTable";

export function useFilterOptions(optionFetcher: () => Promise<IDataTableFilterOption[]>): IDataTableFilterOption[] | null {
  const [options, setOptions] = useState<IDataTableFilterOption[] | null>(null);

  useEffect(() => {
    const fetchOption = async () => {
      const result : IDataTableFilterOption[] = await optionFetcher();
      setOptions(result);
    };
    fetchOption();
  }, []);

  return options;
}
