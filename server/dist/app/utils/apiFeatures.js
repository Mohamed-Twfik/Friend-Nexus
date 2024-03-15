"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class ApiFeature {
    constructor(mongooseQuery, queryString) {
        this.pageSize = 5;
        this.page = 1;
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }
    //[1]to make pagination
    paginate() {
        this.page = (!this.queryString.page || this.queryString.page <= 0) ? this.page : +this.queryString.page;
        this.pageSize = (!this.queryString.pageSize || this.queryString.pageSize <= 0) ? this.pageSize : +this.queryString.pageSize;
        let skip = (this.page - 1) * this.pageSize;
        this.mongooseQuery.skip(skip).limit(this.pageSize);
        return this;
    }
    //[2] to make filter
    filter() {
        let filterObj = Object.assign({}, this.queryString);
        delete filterObj.page;
        delete filterObj.sort;
        delete filterObj.fields;
        delete filterObj.keyword;
        let filterObjToStr = JSON.stringify(filterObj);
        filterObjToStr = filterObjToStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
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
    search(conditions) {
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
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.mongooseQuery;
        });
    }
}
exports.default = ApiFeature;
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
