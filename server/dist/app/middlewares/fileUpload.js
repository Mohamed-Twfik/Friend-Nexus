"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const getUploadMW = () => {
    // to save image in local folder
    const storage = multer_1.default.diskStorage({
        destination: (req, file, callBack) => {
            callBack(null, './uploads');
        },
        filename: (req, file, callBack) => {
            callBack(null, file.fieldname + '-' + Date.now() + path_1.default.extname(file.originalname));
        }
    });
    // // to filter data
    // const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    //   if (file.mimetype.startsWith("image")) {
    //     cb(null, true);
    //   } else {
    //     cb(null, false);
    //   }
    // }
    return (0, multer_1.default)({ storage /* , fileFilter */ });
};
exports.default = getUploadMW();
