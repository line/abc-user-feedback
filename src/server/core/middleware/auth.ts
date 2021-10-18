/* */
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException
} from '@nestjs/common'
import { Response } from 'express'

@Injectable()
export default class AuthMiddleware implements NestMiddleware {
  async use(req: any, res: Response, next: () => void): Promise<any> {
    if (req.path.includes('/auth/logout')) {
      next()
    }

    if (!req.user) {
      throw new UnauthorizedException()
    }
  }
}
