/* */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getManager, Not, getConnection } from 'typeorm'

/* */
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import {
  User,
  UserProfile,
  Account,
  EmailAuth,
  CustomAuth
} from '#/core/entity'
import { UserRole, UserState } from '@/types'
import * as bcrypt from 'bcrypt'

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
    private readonly emailAuthRepository: Repository<EmailAuth> // @InjectRepository(CustomAuth) // private readonly customAuthRepository: Repository<CustomAuth>
  ) {}

  async create(
    data: CreateUserDto,
    options?: { password?: string; withVerify?: boolean; role?: UserRole }
  ) {
    const userCount = await this.userRepository.count()
    const user = new User()
    user.email = data.email

    if (options?.password) {
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(options.password, salt)
      user.hashPassword = hashPassword
    }

    if (options?.withVerify) {
      user.isVerified = true
    }

    if (options?.role) {
      user.role = options.role
    }

    if (!userCount) {
      user.role = UserRole.Owner
    }

    await this.userRepository.save(user)

    const userProfile = new UserProfile()
    userProfile.userId = user.id
    userProfile.nickname = data.nickname
    userProfile.avatarUrl = data.avatarUrl
    await this.userProfileRepository.save(userProfile)

    user.hashPassword = ''
    return user
  }

  async getUsers() {
    return await this.userRepository.find({
      relations: ['profile'],
      where: {
        state: Not(UserState.Left + 1)
      },
      order: {
        createdTime: 'DESC'
      }
    })
  }

  async getUserById(userId: string) {
    const user = this.userRepository.findOne(userId, { relations: ['profile'] })
    return user
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
        user.role = UserRole.User

        await entityManager.update(User, user.id, user)

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

  async roleBinding(userId: string, userRole: UserRole) {
    const user = await this.userRepository.findOne(userId)

    if (!user) {
      throw new NotFoundException()
    }

    user.role = userRole

    await this.userRepository.update(user.id, user)

    return
  }
}
