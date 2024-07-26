/**
 * Copyright 2023 LINE Corporation
 *
 * LINE Corporation licenses this file to you under the Apache License,
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
import { faker } from '@faker-js/faker';

import { ProjectEntity } from '@/domains/admin/project/project/project.entity';
import { projectFixture } from '../fixtures';
import { createQueryBuilder, removeUndefinedValues } from '../util-functions';

export class ProjectRepositoryStub {
  project: ProjectEntity | null = projectFixture;
  findOne() {
    return this.project;
  }

  findOneBy() {
    return this.project;
  }

  find() {
    return [this.project];
  }

  findBy() {
    return [this.project];
  }

  findAndCount() {
    return [[this.project], 1];
  }

  findAndCountBy() {
    return [[this.project], 1];
  }

  save(project) {
    const projectToSave = removeUndefinedValues(project);
    if (Array.isArray(projectToSave)) {
      return projectToSave.map((e) => ({
        ...this.project,
        ...e,
        id: faker.number.int(),
      }));
    } else {
      return {
        ...this.project,
        ...projectToSave,
      };
    }
  }

  count() {
    return 1;
  }

  remove({ id }) {
    return { id };
  }

  setNull() {
    this.project = null;
  }

  createQueryBuilder() {
    createQueryBuilder.getMany = () => [projectFixture];
    return createQueryBuilder;
  }
}
