/* */
import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'
import { In, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

/* */
import { AuthService } from '#/auth/auth.service'
import {
  Role,
  RolePermissionBinding,
  RoleUserBinding,
  User
} from '#/core/entity'
import { UserService } from '#/user/user.service'

@Injectable()
export default class PermissionMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RoleUserBinding)
    private readonly roleUserBindingRepository: Repository<RoleUserBinding>,
    @InjectRepository(RolePermissionBinding)
    private readonly rolePermissionBindingRepository: Repository<RolePermissionBinding>
  ) {}

  async use(req: any, res: Response, next: () => void): Promise<any> {
    if (req.user) {
      const userRoles = await this.roleUserBindingRepository.find({
        where: {
          userId: req.user.id
        }
      })

      const userPermissions = await this.rolePermissionBindingRepository.find({
        where: {
          roleId: In(userRoles.map((userRole) => userRole.roleId))
        }
      })

      const permissions = []

      userPermissions.map((userPermission) => {
        permissions.push(userPermission.permission)
      })

      req.permissions = permissions
    }

    next()
  }
}
