/* */
import { Injectable, NestMiddleware } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Response } from 'express'

/* */
import { Service } from '#/core/entity'

@Injectable()
export default class CheckTenantMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>
  ) {}

  async use(req: any, res: Response, next: () => void): Promise<any> {
    const [service] = await this.serviceRepository.find()
    req.service = service
    next()
  }
}
