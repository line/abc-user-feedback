/* */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'

/* */
import { PERMISSION_KEY } from '#/core/decorators/permission.decorators'
import { Permission } from '@/types'

@Injectable()
export default class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRole(
    requiredPermissions: Array<Permission>,
    userPermissions: Array<Permission>
  ): boolean {
    if (userPermissions.includes(Permission.MANAGE_ALL)) {
      return true
    }

    return requiredPermissions.some((permission) =>
      userPermissions.includes(permission)
    )
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      Array<Permission>
    >(PERMISSION_KEY, [context.getHandler(), context.getClass()])

    if (!requiredPermissions) {
      return true
    }

    const request = context.switchToHttp().getRequest()

    if (!request.user) {
      throw new UnauthorizedException()
    }

    return this.matchRole(requiredPermissions, request.permissions ?? [])
  }
}
