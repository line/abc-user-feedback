/* */
import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

/* */
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { RoleUserDto } from './dto/role-user-binding.dto'
import { RolePermissionDto } from './dto/role-permission-binding.dto'
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

  async findAllRole() {
    return this.roleRepository
      .createQueryBuilder('role')
      .loadRelationCountAndMap('role.bindingCount', 'role.roleUserBindings')
      .getMany()
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

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`
  }

  remove(roleName: string) {
    return `This action removes a #${roleName} role`
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
