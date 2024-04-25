import http from "http";
import { Server, Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel from "./app/models/user.model";
import tokenModel from "./app/models/token.model";

let io: Server;
export default {
  init: (httpServer: http.Server) => {
    const io = new Server(httpServer, { /* options */ });
    io.on("connection", async(socket) => {
      console.log("user connected");
      console.log(socket);
      try {
        const user = await getUserFromSocket(socket);
        user.socketId = socket.id;
        await user.save();
        socket.on("disconnect", async () => {
          console.log("user disconnected");
          console.log(socket);
          user.socketId = undefined;
          await user.save();
        });
      } catch (err) {
        throw new Error(`${err}`);
      }
    });
    return io;
  },
  
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized");
    }
    return io;
  }
}


/**
 * function for validate the token and get the userId from it
 * @param socket the socket object of the io connection
 * @returns user => user document of the token of the socket
 */
const getUserFromSocket = async(socket: Socket) => {
  // [1] check if send token
  const token = socket.handshake.headers.authorization;
  if (!token) throw new Error("Token Required.");
  
  // [2] check if token valid or not
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as JwtPayload;
  const user = await userModel.findById(decoded.id).select({password: 0, emailVerificationCode: 1});
  const tokenData = await tokenModel.findOne({token, user: user?._id});
  if (!user || !tokenData) throw new Error("Invalid Token.");

  // [3] when user change password compare time
  if (user.changePasswordAt) {
    let changePasswordDate = user.changePasswordAt.getTime() / 1000;
    const iat = decoded.iat || 0;
    if (changePasswordDate > iat) throw new Error("Password Changed");
  }

  return user;
}