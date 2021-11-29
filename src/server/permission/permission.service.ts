/* */
import { Injectable } from '@nestjs/common'

/* */
import { Permission } from '@/types'

@Injectable()
export class PermissionService {
  constructor() {}

  getAllPermissions(): Array<string> {
    return Object.entries(Permission).map((e) => e[1])
  }
}
