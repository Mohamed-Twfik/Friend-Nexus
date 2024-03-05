export default interface IUser {
  email: string
  password: string
  fname: string
  lname: string
  logo?: string
  role?: string
  emailVerificationCode: {
    code: string
    expireAt?: Date
  }
}