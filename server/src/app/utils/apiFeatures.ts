import mongoose from "mongoose";
import {
  IApiFeature,
  IQueryString
} from "../types/apiFeature.type";

export default class ApiFeature implements IApiFeature {
  mongooseQuery: mongoose.Query<any, any>;
  private queryString;
  private queryCondition;
  private pageSize: number = 5;
  private page: number = 1;
  
  constructor(mongooseQuery: mongoose.Query<any, any>, queryString: IQueryString, queryCondition: object = {}) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
    this.queryCondition = queryCondition;
  }

  //[1]to make pagination
  paginate() {
    this.page = (!this.queryString.page || this.queryString.page <= 0)? this.page : this.queryString.page;
    this.pageSize = (!this.queryString.pageSize || this.queryString.pageSize <= 0)? this.pageSize : this.queryString.pageSize;
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
    this.queryCondition = {...this.queryCondition, ...filterObj};
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
      this.queryCondition = {...this.queryCondition, ...conditions};
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

  //[7] to get the total length
  async getTotal() {
    return await this.mongooseQuery.model.countDocuments(this.queryCondition);
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