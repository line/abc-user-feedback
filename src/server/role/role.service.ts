/* */
import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

/* */
import {
  RoleDto,
  CreateRoleDto,
  UpdateRoleDto,
  RoleUserDto,
  RolePermissionDto
} from './dto'
import { GUEST_KEY, OWNER_KEY } from '@/constant'
import { Role, RolePermissionBinding, RoleUserBinding } from '#/core/entity'

@Injectable()
export class RoleService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RoleUserBinding)
    private readonly roleUserBindingRepository: Repository<RoleUserBinding>,
    @InjectRepository(RolePermissionBinding)
    private readonly rolePermissionBindingRepository: Repository<RolePermissionBinding>
  ) {}

  async createRole(data: CreateRoleDto) {
    const role = new Role()

    role.name = data.name
    role.description = data.description

    await this.roleRepository.save(role)

    return role
  }

  async findAllRole(offset: number, limit: number) {
    return this.roleRepository
      .createQueryBuilder('role')
      .select([
        'role.id',
        'role.name',
        'role.description',
        'role.createdTime',
        'role.updatedTime'
      ])
      .loadRelationCountAndMap('role.bindingCount', 'role.roleUserBindings')
      .skip(offset)
      .take(limit)
      .getManyAndCount()
  }

  async findRoleByName(roleName: string) {
    const role = await this.roleRepository.findOne({
      where: {
        name: roleName
      }
    })

    if (!role) {
      throw new NotFoundException()
    }

    return role
  }

  async updateRole(roleName: string, updateRoleDto: UpdateRoleDto) {
    if (roleName === OWNER_KEY || roleName === GUEST_KEY) {
      throw new BadRequestException(`cannot update ${roleName}`)
    }

    const role = await this.roleRepository.findOne({
      where: {
        name: roleName
      }
    })

    if (!role) {
      throw new BadRequestException(`${roleName} role is not exists`)
    }

    const { name, description } = updateRoleDto

    role.name = name

    if (description) {
      role.description = description
    }

    await this.roleRepository.update(role.id, role)

    return role
  }

  async removeRole(roleName: string) {
    if (roleName === OWNER_KEY || roleName === GUEST_KEY) {
      throw new BadRequestException(`cannot remove ${roleName}`)
    }

    const role = await this.roleRepository.findOne({
      where: {
        name: roleName
      }
    })

    if (!role) {
      throw new BadRequestException(`${roleName} role is not exists`)
    }

    const roleUserBindingCount = await this.roleUserBindingRepository.count({
      where: {
        roleId: role.id
      }
    })

    if (roleUserBindingCount > 0) {
      throw new BadRequestException(
        `cannot remove role with exist binding user`
      )
    }

    await this.rolePermissionBindingRepository.delete({
      roleId: role.id
    })
    await this.roleRepository.delete(role.id)
  }

  async roleUserBinding(data: RoleUserDto) {
    const { roleName, userId } = data

    const role = await this.roleRepository.findOne({
      where: {
        name: roleName
      }
    })

    if (!role) {
      throw new BadRequestException(`${roleName} role is not exists`)
    }

    const roleUserBinding = await this.roleUserBindingRepository.findOne({
      where: {
        userId: userId
      }
    })

    if (roleUserBinding) {
      await this.roleUserBindingRepository.update(roleUserBinding.id, {
        roleId: role.id
      })
    } else {
      const newBinding = new RoleUserBinding()
      newBinding.roleId = role.id
      newBinding.userId = userId

      await this.roleUserBindingRepository.save(newBinding)
    }
  }

  async rolePermissionBinding(data: RolePermissionDto) {
    const { roleName, permission } = data

    const role = await this.findRoleByName(roleName)

    const binding = await this.rolePermissionBindingRepository.findOne({
      where: {
        roleId: role.id,
        permission
      }
    })

    if (binding) {
      throw new BadRequestException()
    }

    const newBinding = new RolePermissionBinding()
    newBinding.roleId = role.id
    newBinding.permission = permission

    await this.rolePermissionBindingRepository.save(newBinding)

    return newBinding
  }

  async rolePermissionUnbinding(data: RolePermissionDto) {
    const { roleName, permission } = data

    const role = await this.findRoleByName(roleName)

    await this.rolePermissionBindingRepository.delete({
      roleId: role.id,
      permission
    })
  }

  async roleUserUnbinding(roleUserDto: RoleUserDto) {
    // const { roleName, permission } = data
    //
    // const role = await this.findRoleByName(roleName)
  }

  async getRolePermissions(roleName: string) {
    const role = await this.findRoleByName(roleName)

    const permissions = await this.rolePermissionBindingRepository.find({
      where: {
        roleId: role.id
      }
    })

    return permissions.map((p) => p.permission)
  }
}
