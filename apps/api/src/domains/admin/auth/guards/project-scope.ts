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
import type { DataSource, EntityTarget, ObjectLiteral } from 'typeorm';

import { ChannelEntity } from '../../channel/channel/channel.entity';
import { ApiKeyEntity } from '../../project/api-key/api-key.entity';
import { CategoryEntity } from '../../project/category/category.entity';
import { IssueEntity } from '../../project/issue/issue.entity';
import { MemberEntity } from '../../project/member/member.entity';
import { RoleEntity } from '../../project/role/role.entity';
import { WebhookEntity } from '../../project/webhook/webhook.entity';

const belongsToProject = (projectId: number) => ({
  project: { id: projectId },
});

const PROJECT_SCOPED_PARAMS: [
  string,
  EntityTarget<ObjectLiteral>,
  (projectId: number) => object,
][] = [
  ['channelId', ChannelEntity, belongsToProject],
  ['issueId', IssueEntity, belongsToProject],
  ['categoryId', CategoryEntity, belongsToProject],
  ['apiKeyId', ApiKeyEntity, belongsToProject],
  ['roleId', RoleEntity, belongsToProject],
  ['webhookId', WebhookEntity, belongsToProject],
  [
    'memberId',
    MemberEntity,
    (projectId) => ({ role: { project: { id: projectId } } }),
  ],
];

/**
 * Checks that every resource id in the route params belongs to `:projectId`,
 * so a credential scoped to one project cannot reach another project's
 * resources by changing an id in the URL. Ids that do not exist are left to the
 * handler so it can still answer 404.
 */
export async function isWithinProjectScope(
  dataSource: DataSource,
  params: Record<string, string | undefined>,
): Promise<boolean> {
  const projectId = Number(params.projectId);
  if (!Number.isInteger(projectId)) return false;

  for (const [param, entity, projectWhere] of PROJECT_SCOPED_PARAMS) {
    if (params[param] === undefined) continue;
    const id = Number(params[param]);
    if (!Number.isInteger(id)) return false;

    const repo = dataSource.getRepository(entity);
    const inProject = await repo.exists({
      where: { id, ...projectWhere(projectId) },
      withDeleted: true,
    });
    if (inProject) continue;

    const exists = await repo.exists({ where: { id }, withDeleted: true });
    if (exists) return false;
  }
  return true;
}
