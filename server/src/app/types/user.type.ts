import { Document } from 'mongoose'

export default interface IUser extends Document {
  email: string
  password: string
  fname: string
  lname: string
  logo?: string
  role?: string
  changePasswordAt?: Date
  emailVerificationCode?: {
    code: string
    expireAt?: Date
  }
  resetPasswordCode?: {
    code: string
    expireAt?: Date
  }
  newEmail?: string
  verified?: boolean
}