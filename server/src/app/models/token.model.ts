import mongoose from "mongoose";
import { ITokenSchema } from "../types/token.type";

const tokenSchema = new mongoose.Schema<ITokenSchema>({
    token: {
      type: String,
      unique: true,
      required: true
    },
    client: {
      clientName: {
        type: String
      },
      clientType: {
        type: String
      },
      clientVersion: {
        type: String
      },
      clientEngine: {
        type: String
      },
      clientEngineVersion: {
        type: String
      },
    },
    os: {
      osName: {
        type: String
      },
      osVersion: {
        type: String
      },
      osPlatform: {
        type: String
      },
    },
    device: {
      deviceType: {
        type: String
      },
      deviceBrand: {
        type: String
      },
      deviceModel: {
        type: String
      },
    },
    bot: {
      type: String
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  { timestamps: true }
)


export default mongoose.model<ITokenSchema>("Token", tokenSchema);