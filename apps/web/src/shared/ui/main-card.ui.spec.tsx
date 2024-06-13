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

import { IconNames } from '@ufb/ui';

import MainCard from './main-card.ui';

import { render } from '@/utils/test-utils';

describe('MainCard', () => {
  test('snapshot', async () => {
    const { container } = render(
      <MainCard
        icon={{
          bgColor: '#48DECC',
          iconName: faker.helpers.arrayElement(IconNames),
        }}
        leftContent={{
          title: faker.lorem.word(),
          count: faker.number.int(),
        }}
        rightContent={{
          title: faker.lorem.word(),
          count: faker.number.int(),
        }}
        title={faker.lorem.word()}
        description={faker.lorem.words()}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
