import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from '@nestjs/common'

@Injectable()
export default class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()

    if (!request.user) {
      throw new UnauthorizedException()
    }

    return true
  }
}
