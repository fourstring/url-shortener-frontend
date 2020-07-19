export interface IHalPage {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  }
  
  export interface IHalList<T> {
    _embedded: {
      [resource: string]: T[]
    };
    page: IHalPage;
  }
  
  export interface IPagedData<T> {
    count:number;
    results:T[];
  }