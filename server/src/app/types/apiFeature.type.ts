export interface IApiFeature {
  paginate(): IApiFeature;
  filter(): IApiFeature;
  sort(): IApiFeature;
  search(conditions: object[]): IApiFeature;
  fields(): IApiFeature;
}

export interface IQueryString {
  page?: number;
  pageSize?: number;
  sort?: string;
  fields?: string;
  keyword?: string;
  search?: string;
};