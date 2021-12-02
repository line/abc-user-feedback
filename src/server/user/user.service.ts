/* */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Repository, getManager, Not, getConnection, In } from 'typeorm'

/* */
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { OWNER_KEY } from '@/constant'
import {
  User,
  UserProfile,
  Account,
  EmailAuth,
  Role,
  RoleUserBinding,
  RolePermissionBinding
} from '#/core/entity'
import { UserState } from '@/types'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private readonly userProfileRepository: Repository<UserProfile>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(EmailAuth)
    private readonly emailAuthRepository: Repository<EmailAuth>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RoleUserBinding)
    private readonly roleUserBindingRepository: Repository<RoleUserBinding>,
    @InjectRepository(RolePermissionBinding)
    private readonly rolePermissionBindingRepository: Repository<RolePermissionBinding>
  ) {}

  async create(
    data: CreateUserDto,
    options?: { password?: string; withVerify?: boolean; role?: string }
  ) {
    const queryRunner = await getConnection().createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    let user = new User()

    try {
      const userCount = await this.userRepository.count({
        where: {
          isVerified: true
        }
      })

      if (options?.password) {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(options.password, salt)
        user.hashPassword = hashPassword
      }

      if (options?.withVerify) {
        user.isVerified = true
      }

      await getManager().transaction(async (entityManager) => {
        user.email = data.email

        await entityManager.save(User, user)

        if (!userCount || options?.role) {
          const roleName = !userCount ? OWNER_KEY : options.role
          const role = await this.roleRepository.findOne({
            name: roleName
          })

          if (!role) {
            throw new BadRequestException(`${options.role} role not exists`)
          }

          const roleUserBinding = new RoleUserBinding()
          roleUserBinding.userId = user.id
          roleUserBinding.roleId = role.id

          await entityManager.save(RoleUserBinding, roleUserBinding)
        }

        const userProfile = new UserProfile()
        userProfile.userId = user.id
        userProfile.nickname = data.nickname
        userProfile.avatarUrl = data.avatarUrl

        await entityManager.save(UserProfile, userProfile)

        user.hashPassword = ''
      })
    } catch (err) {
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException(err)
    } finally {
      await queryRunner.release()
    }

    return user
  }

  async getUsers() {
    return this.userRepository
      .createQueryBuilder('user')
      .where({
        state: Not(UserState.Left + 1)
      })
      .leftJoin('user.profile', 'profile')
      .addSelect('profile.nickname')
      .leftJoin('user.roleUserBindings', 'roleUserBindings')
      .leftJoinAndMapOne(
        'user.role',
        Role,
        'role',
        'role.id = roleUserBindings.roleId'
      )
      .orderBy('user.createdTime', 'DESC')
      .getMany()
  }

  async getUserById(userId: string) {
    return this.userRepository.findOne(userId, {
      relations: ['profile']
    })
  }

  async getUserByEmail(email: string) {
    const user = this.userRepository.findOne({
      where: { email },
      relations: ['profile']
    })

    return user
  }

  async update(userId: string, partial?: any) {
    const user = this.userRepository.update(userId, partial)
    return user
  }

  async updateUserProfile(userId: string, data: UpdateUserDto) {
    const userProfile = await this.userProfileRepository.findOne({
      where: {
        userId
      }
    })

    if (!userProfile) {
      throw new BadRequestException('cannot find user profile')
    }

    userProfile.nickname = data.nickname

    await this.userProfileRepository.update(userProfile.id, userProfile)

    return userProfile
  }

  async deleteUser(userId: string) {
    const user = await this.userRepository.findOne(userId)

    if (!user) {
      throw new BadRequestException('cannot find user')
    }

    const queryRunner = await getConnection().createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      await getManager().transaction(async (entityManager) => {
        user.email = null
        user.state = UserState.Left

        await entityManager.update(User, user.id, user)

        await entityManager.delete(RoleUserBinding, { userId: user.id })
        await entityManager.delete(UserProfile, { userId: user.id })
        await entityManager.delete(Account, { userId: user.id })
        await entityManager.delete(EmailAuth, { email: user.email })
      })

      await queryRunner.commitTransaction()
    } catch (err) {
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException(err)
    } finally {
      await queryRunner.release()
    }

    return
  }
}
