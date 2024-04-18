export interface IApiFeature {
  paginate(): IApiFeature;
  filter(): IApiFeature;
  sort(): IApiFeature;
  search(conditions: object[]): IApiFeature;
  fields(): IApiFeature;
  get(): Promise<any>;
  getTotal(): Promise<number>;
}

export interface IQueryString {
  page?: number;
  pageSize?: number;
  sort?: string;
  fields?: string;
  keyword?: string;
  search?: string;
};