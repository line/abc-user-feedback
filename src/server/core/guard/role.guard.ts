/* */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

/* */
import { ROLE_KEY } from '#/core/decorators/role.decorators'
import { UserRole } from '@/types'

@Injectable()
export default class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRole(requiredRoles: Array<UserRole>, userRole: UserRole): boolean {
    return requiredRoles.some((role) => userRole >= role)
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Array<UserRole>>(
      ROLE_KEY,
      [context.getHandler(), context.getClass()]
    )

    if (!requiredRoles) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    if (!request.user) {
      throw new UnauthorizedException()
    }

    return this.matchRole(requiredRoles, request.user.role)
  }
}
