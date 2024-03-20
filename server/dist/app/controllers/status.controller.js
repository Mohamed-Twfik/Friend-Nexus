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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStatus = exports.createStatus = exports.getOneStatus = exports.getFriendsStatusList = exports.getUserStatusList = void 0;
const status_model_1 = __importDefault(require("../models/status.model"));
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const friendShip_model_1 = __importDefault(require("../models/friendShip.model"));
exports.getUserStatusList = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.authUser;
    const queryString = {
        page: req.query.page,
        pageSize: req.query.pageSize,
        sort: "-createdAt",
        search: req.query.search,
        fields: "-__v",
    };
    const apiFeatures = new apiFeatures_1.default(status_model_1.default.find({ user: user._id }), queryString)
        .paginate()
        .fields()
        .search({
        content: { $regex: queryString.search, $options: "i" }
    })
        .sort();
    const statuses = yield apiFeatures.get();
    const total = statuses.length;
    const response = {
        message: "Success",
        data: {
            statuses,
            total
        }
    };
    res.status(200).json(response);
}));
exports.getFriendsStatusList = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.authUser;
    const queryString = {
        page: req.query.page,
        pageSize: req.query.pageSize,
        sort: "-createdAt",
        search: req.query.search,
        fields: "-__v",
    };
    const userFriends = yield friendShip_model_1.default.find({
        $or: [
            { user1: user._id, status: "accepted" },
            { user2: user._id, status: "accepted" }
        ]
    });
    const friends = userFriends.map(friendShip => {
        if (friendShip.user1.toString() === user._id.toString())
            return friendShip.user2;
        return friendShip.user1;
    });
    const apiFeatures = new apiFeatures_1.default(status_model_1.default.find({ user: { $in: friends } }), queryString)
        .paginate()
        .fields()
        .search({
        content: { $regex: queryString.search, $options: "i" }
    })
        .sort();
    const statuses = yield apiFeatures.get();
    const total = statuses.length;
    const response = {
        message: "Success",
        data: {
            statuses,
            total
        }
    };
    res.status(200).json(response);
}));
exports.getOneStatus = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.status;
    const response = {
        message: "Success",
        data: status,
    };
    res.status(200).json(response);
}));
exports.createStatus = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.authUser;
    const { content } = req.body;
    const statusData = {
        content: content || "",
        user: user._id
    };
    const status = yield status_model_1.default.create(statusData);
    const response = {
        message: "Success",
        data: status,
    };
    res.status(201).json(response);
}));
exports.deleteStatus = (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const status = req.status;
    yield status.deleteOne();
    const response = {
        message: "Success",
    };
    res.status(200).json(response);
}));
