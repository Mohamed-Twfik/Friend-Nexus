import multer, {FileFilterCallback} from "multer";
import path from "path";
import {Request} from "express";
import {DestinationCallback, FileNameCallback} from "../types/nodemailer";

const getUploadMW = () => {
  // to save image in local folder
  const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, callBack: DestinationCallback): void => {
      callBack(null, './uploads')
    },
    filename: (req: Request, file: Express.Multer.File, callBack: FileNameCallback): void => {
      callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
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
  
  return multer({storage/* , fileFilter */});
};
export default getUploadMW();