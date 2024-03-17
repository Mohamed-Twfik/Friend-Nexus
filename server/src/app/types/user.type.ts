import { Document } from 'mongoose'

export interface IUser {
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

export interface IUserSchema extends IUser, Document {}