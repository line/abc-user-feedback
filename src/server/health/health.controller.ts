import { Controller, Get } from '@nestjs/common'
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  HealthCheck
} from '@nestjs/terminus'

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
