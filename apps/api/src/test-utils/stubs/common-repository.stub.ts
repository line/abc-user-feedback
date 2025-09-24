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
import { faker } from '@faker-js/faker';

import { createQueryBuilder, removeUndefinedValues } from '../util-functions';

export class CommonRepositoryStub<T> {
  entities: T[] | null;

  constructor(entity: T[] | null) {
    this.entities = entity;
  }

  findOne(input?: { where: Partial<T> }) {
    const entity = this.entities?.[0];
    if (!entity) return null;
    return { ...entity, ...input?.where };
  }

  findOneBy() {
    const entity = this.entities?.[0];
    if (!entity) return null;
    return entity;
  }

  find() {
    return this.entities;
  }

  findBy() {
    return this.entities;
  }

  findAndCount() {
    return [this.entities, this.entities?.length];
  }

  findAndCountBy() {
    return [this.entities, this.entities?.length];
  }

  save(entity: T) {
    const entityToSave = removeUndefinedValues(entity as object);
    this.entities?.push(entityToSave as T);
    if (Array.isArray(entityToSave)) {
      return (entityToSave as T[]).map((e) => ({
        ...this.entities?.[0],
        ...e,
        id: faker.number.int(),
      }));
    }
    return { ...this.entities?.[0], ...entityToSave };
  }
  update(entity: T) {
    const entityToSave = removeUndefinedValues(entity as object);
    if (Array.isArray(entityToSave)) {
      return (entityToSave as T[]).map((e) => ({
        ...this.entities?.[0],
        ...e,
      }));
    }
    return { ...this.entities?.[0], ...entityToSave };
  }

  count() {
    return this.entities?.length ?? 0;
  }

  remove({ id }: { id: number }) {
    return { id };
  }

  createQueryBuilder() {
    createQueryBuilder.getMany = () => this.entities;
    return createQueryBuilder;
  }
}
