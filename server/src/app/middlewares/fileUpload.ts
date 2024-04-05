import multer, {FileFilterCallback} from "multer";
import path from "path";
import {Request} from "express";
import {DestinationCallback, FileNameCallback} from "../types/multer";
import catchErrors from "../utils/catchErrors";
import errorMessage from "../utils/errorMessage";

const getUploadMW = (filter: "image" | "media" | "any", operation: "single" | "array", fileInBody: string) => {
  // to save image in local folder
  const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, callBack: DestinationCallback): void => {
      callBack(null, './uploads')
    },
    filename: (req: Request, file: Express.Multer.File, callBack: FileNameCallback): void => {
      callBack(null, 'file-' + Date.now() + path.extname(file.originalname))
    }
  });
  // to filter files
  const imageFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  };
  const mediaFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    // Accept image and video files
    if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video') || file.mimetype.startsWith('audio')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'));
    }
  };

  let upload;
  if (filter === "image") {
    upload = multer({storage, fileFilter: imageFilter});
  }else if (filter === "media") {
    upload = multer({storage, fileFilter: mediaFilter});
  } else {
    upload = multer({storage});
  }

  let uploadOperation: Function;
  if (operation === "single") uploadOperation = upload.single(fileInBody);
  else uploadOperation = upload.array(fileInBody, 10);

  return catchErrors(async (req, res, next) => {
    uploadOperation(req, res, function (err: Error) {
      if (err) return next(errorMessage(422, err.message));
      next();
    });
  });
};

export default getUploadMW;