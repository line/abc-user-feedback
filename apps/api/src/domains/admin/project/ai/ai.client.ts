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
import axios, { AxiosInstance } from 'axios';

import { AIProvidersEnum } from '@/common/enums/ai-providers.enum';

interface AIClientConfig {
  apiKey: string;
  provider: AIProvidersEnum;
}

export class AIClient {
  private axiosInstance: AxiosInstance;
  private provider: AIProvidersEnum;
  private apiKey: string;

  constructor(config: AIClientConfig) {
    this.provider = config.provider;
    this.apiKey = config.apiKey;

    let baseURL = '';
    let headers = {};

    if (this.provider === AIProvidersEnum.OPEN_AI) {
      baseURL = 'https://api.openai.com/v1';
      headers = {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      };
    } else if (this.provider === AIProvidersEnum.GEMINI) {
      baseURL = 'https://generativelanguage.googleapis.com/v1beta';
    }

    this.axiosInstance = axios.create({
      baseURL,
      headers,
    });
  }

  async getModelList() {
    try {
      const endpoint = '/models';
      let response;

      if (this.provider === AIProvidersEnum.OPEN_AI) {
        response = await this.axiosInstance.get(endpoint);
        return response.data.data.map((model: any) => ({
          id: model.id,
        }));
      } else if (this.provider === AIProvidersEnum.GEMINI) {
        response = await this.axiosInstance.get(endpoint, {
          params: { key: this.apiKey },
        });
        return response.data.models.map((model: any) => ({
          id: model.name,
        }));
      }
    } catch (error) {
      throw new Error(`Error fetching model list: ${error}`);
    }
  }
}
