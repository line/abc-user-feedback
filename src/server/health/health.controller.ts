import { Controller, Get } from '@nestjs/common'
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  HealthCheck
} from '@nestjs/terminus'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.db.pingCheck('database')])
  }
}
