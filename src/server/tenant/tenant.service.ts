/* */
import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

/* */
import { Service } from '#/core/entity'
import { Locale } from '@/types'
import { CreateServiceDto } from './dto/create-service.dto'

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>
  ) {}

  async create(data: CreateServiceDto) {
    const [preSerivce] = await this.serviceRepository.find()

    if (preSerivce) {
      throw new BadRequestException('service already created')
    }

    const service = new Service()
    service.name = data.name
    service.description = data.description
    service.logoUrl = data.logoUrl
    service.entryPath = '/'
    service.locale = Locale.EN
    service.isPrivate = false
    service.isRestrictDomain = false
    service.allowDomains = []

    return await this.serviceRepository.save(service)
  }
}
