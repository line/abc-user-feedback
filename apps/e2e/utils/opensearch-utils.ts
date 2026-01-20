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
import { Client } from '@opensearch-project/opensearch';

export interface OpenSearchConfig {
  node: string;
  username?: string;
  password?: string;
}

export async function createOpenSearchClient(
  config: OpenSearchConfig,
): Promise<Client> {
  const clientConfig: any = {
    node: config.node,
  };

  if (config.username && config.password) {
    clientConfig.auth = {
      username: config.username,
      password: config.password,
    };
  }

  return new Client(clientConfig);
}

export async function waitForOpenSearch(
  client: Client,
  maxRetries = 30,
  delayMs = 1000,
): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await client.ping();
      console.log('OpenSearch is ready');
      return;
    } catch (error) {
      console.log(`Waiting for OpenSearch... (${i + 1}/${maxRetries})`);
      if (i === maxRetries - 1) {
        throw new Error(
          `OpenSearch is not available after ${maxRetries} retries`,
        );
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

export async function clearOpenSearchIndices(client: Client): Promise<void> {
  try {
    const response = await client.cat.indices({ format: 'json' });
    const indices = response.body as Array<{ index: string }>;

    const channelIndices = indices
      .filter((index) => index.index.startsWith('channel_'))
      .map((index) => index.index);

    if (channelIndices.length > 0) {
      console.log(`Deleting OpenSearch indices: ${channelIndices.join(', ')}`);
      await client.indices.delete({ index: channelIndices });
      console.log('OpenSearch indices cleared');
    } else {
      console.log('No channel indices found in OpenSearch');
    }
  } catch (error) {
    console.log('Error clearing OpenSearch indices:', error);
  }
}

export async function initializeOpenSearchForTest(): Promise<void> {
  const config: OpenSearchConfig = {
    node: 'http://localhost:9200',
  };

  const client = await createOpenSearchClient(config);

  try {
    await waitForOpenSearch(client);
    await clearOpenSearchIndices(client);
    console.log('OpenSearch initialized for test');
  } catch (error) {
    console.error('Failed to initialize OpenSearch:', error);
    throw error;
  }
}

export async function cleanupOpenSearchAfterTest(): Promise<void> {
  const config: OpenSearchConfig = {
    node: 'http://localhost:9200',
  };

  const client = await createOpenSearchClient(config);

  try {
    await clearOpenSearchIndices(client);
    console.log('OpenSearch cleaned up after test');
  } catch (error) {
    console.error('Failed to cleanup OpenSearch:', error);
  }
}
