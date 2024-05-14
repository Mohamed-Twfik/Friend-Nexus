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
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const catchErrors_1 = __importDefault(require("../utils/catchErrors"));
const errorMessage_1 = __importDefault(require("../utils/errorMessage"));
const getUploadMW = (filter, operation, fileInBody) => {
    // to save image in local folder
    const storage = multer_1.default.diskStorage({
        destination: (req, file, callBack) => {
            callBack(null, './uploads');
        },
        filename: (req, file, callBack) => {
            callBack(null, 'file-' + Date.now() + path_1.default.extname(file.originalname));
        }
    });
    // to filter files
    const imageFilter = (req, file, cb) => {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        }
        else {
            cb(new Error("Only image files are allowed!"));
        }
    };
    const mediaFilter = (req, file, cb) => {
        // Accept image and video files
        if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video') || file.mimetype.startsWith('audio')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image and video files are allowed!'));
        }
    };
    let upload;
    if (filter === "image") {
        upload = (0, multer_1.default)({ storage, fileFilter: imageFilter });
    }
    else if (filter === "media") {
        upload = (0, multer_1.default)({ storage, fileFilter: mediaFilter });
    }
    else {
        upload = (0, multer_1.default)({ storage });
    }
    let uploadOperation;
    if (operation === "single")
        uploadOperation = upload.single(fileInBody);
    else
        uploadOperation = upload.array(fileInBody, 10);
    return (0, catchErrors_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        uploadOperation(req, res, function (err) {
            if (err)
                return next((0, errorMessage_1.default)(422, err.message));
            next();
        });
    }));
};
exports.default = getUploadMW;
