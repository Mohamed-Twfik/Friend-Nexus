import catchErrors from "../utils/catchErrors";
import errorMessage from "../utils/errorMessage";

export const checkTokenOwner = catchErrors(async (req, res, next) => {
  const user = req.authUser;
  const token = req.token;
  if (token.user.toString() !== user._id.toString()) return next(errorMessage(403, "Access Denied"));
  next();
});