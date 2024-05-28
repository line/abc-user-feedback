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
import { channelFixture } from '../fixtures';
import { createQueryBuilder, removeUndefinedValues } from '../util-functions';

export class ChannelRepositoryStub {
  channel = channelFixture;
  findOne() {
    return this.channel;
  }

  findOneBy() {
    return this.channel;
  }

  find() {
    return [this.channel];
  }

  findBy() {
    return [this.channel];
  }

  findAndCount() {
    return [[this.channel], 1];
  }

  findAndCountBy() {
    return [[this.channel], 1];
  }

  save(channel) {
    const channelToSave = removeUndefinedValues(channel);
    return {
      ...this.channel,
      ...channelToSave,
    };
  }

  count() {
    return 1;
  }

  remove({ id }) {
    return { id };
  }

  setImageConfig(config) {
    this.channel.imageConfig = config;
  }

  setNull() {
    this.channel = null;
  }

  createQueryBuilder() {
    createQueryBuilder.getMany = () => [channelFixture];
    return createQueryBuilder;
  }
}
