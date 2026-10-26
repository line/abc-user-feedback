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
import type { DataSource } from 'typeorm';

import { isWithinProjectScope } from './project-scope';

const createDataSource = (rows: { id: number; projectId: number }[]) => {
  const exists = jest.fn(
    ({ where }: { where: { id: number; project?: { id: number } } }) =>
      Promise.resolve(
        rows.some(
          (row) =>
            row.id === where.id &&
            (!where.project || row.projectId === where.project.id),
        ),
      ),
  );
  return {
    dataSource: { getRepository: () => ({ exists }) } as unknown as DataSource,
    exists,
  };
};

describe('isWithinProjectScope', () => {
  it('allows a resource that belongs to the project', async () => {
    const { dataSource } = createDataSource([{ id: 10, projectId: 1 }]);

    await expect(
      isWithinProjectScope(dataSource, { projectId: '1', channelId: '10' }),
    ).resolves.toBe(true);
  });

  it('rejects a resource that belongs to another project', async () => {
    const { dataSource } = createDataSource([{ id: 10, projectId: 2 }]);

    await expect(
      isWithinProjectScope(dataSource, { projectId: '1', channelId: '10' }),
    ).resolves.toBe(false);
  });

  it('leaves unknown ids to the handler', async () => {
    const { dataSource } = createDataSource([]);

    await expect(
      isWithinProjectScope(dataSource, { projectId: '1', issueId: '99' }),
    ).resolves.toBe(true);
  });

  it('rejects a non-numeric project id', async () => {
    const { dataSource, exists } = createDataSource([]);

    await expect(
      isWithinProjectScope(dataSource, { projectId: 'abc' }),
    ).resolves.toBe(false);
    expect(exists).not.toHaveBeenCalled();
  });
});
