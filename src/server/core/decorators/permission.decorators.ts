/* */
import { SetMetadata } from '@nestjs/common'

/* */
import { Permission } from '@/types'

export const PERMISSION_KEY = 'permissions'

export const Permissions = (...permissions: Array<Permission>) =>
  SetMetadata(PERMISSION_KEY, permissions)
