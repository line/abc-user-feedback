/* */
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

/* */
import { Service } from '#/core/entity'
import { UpdateServiceDto, UpdateServiceInvitationDto } from './dto'

@Injectable()
export class AdminService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>
  ) {}

  async getService() {
    const service = await this.serviceRepository.findOne()
    return service
  }

  async updateService(data: UpdateServiceDto) {
    const service = await this.serviceRepository.findOne()

    if (!service) {
      throw new BadRequestException('service not exist. create first')
    }

    service.name = data.name
    service.logoUrl = data.logoUrl
    service.description = data.description
    service.entryPath = data.entryPath
    service.isPrivate = data.isPrivate

    await this.serviceRepository.update(service.version, service)

    return service
  }

  async updateInvitation(data: UpdateServiceInvitationDto) {
    const service = await this.serviceRepository.findOne()

    if (!service) {
      throw new BadRequestException('service not exist. create first')
    }

    service.isRestrictDomain = data.isRestrictDomain
    service.allowDomains = data.allowDomains

    await this.serviceRepository.update(service.version, service)

    return service
  }
}
