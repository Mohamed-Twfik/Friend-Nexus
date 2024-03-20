import { Types, Document } from "mongoose"
import { IUserSchema } from "./user.type"
import { IChatSchema } from "./chat.type"

export interface IMessage {
  content: string
  files?: string[]
  user: Types.ObjectId | IUserSchema
  chat: Types.ObjectId | IChatSchema
}

export interface IMessageSchema extends IMessage, Document { }