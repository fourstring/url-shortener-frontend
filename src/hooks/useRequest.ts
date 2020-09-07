import {useEffect, useState} from "react";

export interface IRequestState<T> {
  data: T | null;
  error: any;
  loading: boolean;
}

export function useRequest<T>(request: () => Promise<T>): IRequestState<T> {
  const [state, setState] = useState<IRequestState<T>>({data: null, error: null, loading: true});
  useEffect(() => {
    const fetchData = async () => {
      try {
        let data = await request();
        setState({
          data,
          error: null,
          loading: false
        });
      } catch (e) {
        setState({
          data: null,
          error: e,
          loading: false
        });
      }
    }
    fetchData();
  }, [request]);

  return state;
}
