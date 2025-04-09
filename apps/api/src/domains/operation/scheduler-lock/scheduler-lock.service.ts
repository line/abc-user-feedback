/**
 * Copyright 2025 LY Corporation
 *
 * LY Corporation licenses this file to you under the Apache License,
 * version 2.0 (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at:
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import type { ConfigServiceType } from '@/types/config-service.type';
import { LockTypeEnum } from './lock-type.enum';
import { SchedulerLockEntity } from './scheduler-lock.entity';

interface AppConfig {
  serverId?: string | undefined;
}

@Injectable()
export class SchedulerLockService {
  private readonly serverId: string | undefined;
  constructor(
    @InjectRepository(SchedulerLockEntity)
    private readonly repository: Repository<SchedulerLockEntity>,
    private readonly configService: ConfigService<ConfigServiceType>,
  ) {
    const appConfig: AppConfig | undefined = this.configService.get('app', {
      infer: true,
    });
    this.serverId = appConfig?.serverId;
  }

  @Transactional()
  async acquireLock(
    lockType: LockTypeEnum,
    lockTTLInMilliseconds: number,
  ): Promise<boolean | null> {
    const expiryTime = DateTime.utc()
      .plus({ milliseconds: lockTTLInMilliseconds })
      .toJSDate();

    const query = `
      INSERT INTO scheduler_locks (lock_type, server_id, timestamp)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        server_id = IF(timestamp <= NOW() OR server_id = ?, VALUES(server_id), server_id),
        timestamp = IF(timestamp <= NOW() OR server_id = ?, ?, timestamp);
    `;

    const parameters = [
      lockType,
      this.serverId,
      expiryTime,
      this.serverId,
      this.serverId,
      expiryTime,
    ];

    try {
      await this.repository.query(query, parameters);
      const lock = await this.repository.findOne({
        where: {
          lockType,
        },
      });

      const hasLock =
        lock && lock.serverId === this.serverId && lock.timestamp > new Date();
      return hasLock;
    } catch {
      return false;
    }
  }

  async releaseLock(lockType: LockTypeEnum): Promise<void> {
    await this.repository.delete({ lockType, serverId: this.serverId });
  }
}
