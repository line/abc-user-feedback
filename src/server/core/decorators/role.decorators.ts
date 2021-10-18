/* */
import { SetMetadata } from '@nestjs/common'

/* */
import { UserRole } from '@/types'

export const ROLE_KEY = 'roles'

export const Roles = (...roles: Array<UserRole>) => SetMetadata(ROLE_KEY, roles)
