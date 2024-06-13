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
import JSDOMEnvironment from 'jest-environment-jsdom';

// https://github.com/facebook/jest/blob/v29.4.3/website/versioned_docs/version-29.4/Configuration.md#testenvironment-string
export default class FixJSDOMEnvironment extends JSDOMEnvironment {
  constructor(...args: ConstructorParameters<typeof JSDOMEnvironment>) {
    super(...args);

    // FIXME https://github.com/jsdom/jsdom/issues/3363
    this.global.structuredClone = structuredClone;
  }
}
