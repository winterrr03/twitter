import { Request } from 'express'
import { TokenPayLoad } from './models/requests/User.requests'
import User from './models/schemas/User.schema'
declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayLoad
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload
  }
}
