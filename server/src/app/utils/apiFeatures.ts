import mongoose from "mongoose";

interface IApiFeature {
  paginate(): IApiFeature;
  filter(): IApiFeature;
  sort(): IApiFeature;
  search(conditions: object[]): IApiFeature;
  fields(): IApiFeature;
}
export default class ApiFeature implements IApiFeature {
  mongooseQuery: mongoose.Query<any, any>;
  private queryString;
  private pageSize: number = 5;
  private page: number = 1;
  
  constructor(mongooseQuery: mongoose.Query<any, any>, queryString: any) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  //[1]to make pagination
  paginate() {
    this.page = (!this.queryString.page || this.queryString.page <= 0)? this.page : +this.queryString.page;
    this.pageSize = (!this.queryString.pageSize || this.queryString.pageSize <= 0)? this.pageSize : +this.queryString.pageSize;
    let skip = (this.page - 1) * this.pageSize;
    this.mongooseQuery.skip(skip).limit(this.pageSize);
    return this;
  }

  //[2] to make filter
  filter() {
    let filterObj = { ...this.queryString };
    delete filterObj.page;
    delete filterObj.sort;
    delete filterObj.fields;
    delete filterObj.keyword;
    let filterObjToStr = JSON.stringify(filterObj);
    filterObjToStr = filterObjToStr.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match:string) => `$${match}`
    );
    filterObjToStr = JSON.parse(filterObjToStr);
    this.mongooseQuery.find(filterObj);
    return this;
  }

  //[3] to make sort
  sort() {
    if (this.queryString.sort) {
      let sortBy = this.queryString.sort.replace(/,/g, " ");
      this.mongooseQuery.sort(sortBy);
    }
    return this;
  }

  //[4] to make search
  search(conditions: object) {
    if (this.queryString.search) {
      this.mongooseQuery.find(conditions);
    }
    return this;
  }

  //[5] to make select
  fields() {
    if (this.queryString.fields) {
      let fields = this.queryString.fields.replace(/,/g, " ");
      this.mongooseQuery.select(fields);
    }
    return this;
  }

  //[6] to get the result
  async get() {
    return await this.mongooseQuery;
  }

}

// ex to use

// const getAllUser = catchError(async (request, response, next) => {
//   let apiFeature = new ApiFeature(userModel.find(), request.query)
//     .paginate()
//     .filter()
//     .fields()
//     .search()
//     .sort();
//   //? execute query
//   let result = await apiFeature.mongooseQuery;
//   response.status(200).json({
//     message: "Done 😃",
//     result,
//   });
// });