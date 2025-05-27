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
import axios from 'axios';
import type { AxiosInstance } from 'axios';

import { AIProvidersEnum } from '@/common/enums/ai-providers.enum';

interface AIClientConfig {
  apiKey: string;
  provider: AIProvidersEnum;
  baseUrl: string;
}

interface Model {
  id: string;
  name?: string;
  model?: string;
}

interface ModelListResponse {
  data: {
    data: Model[];
    models: Model[];
  };
}

interface ExecutePromptResponse {
  data: {
    choices: { message: { content: string } }[];
    candidates: { content: { parts: { text: string }[] } }[];
  };
}

export class AIClient {
  private axiosInstance: AxiosInstance;
  private provider: AIProvidersEnum;
  private apiKey: string;
  private baseUrl: string;

  constructor(config: AIClientConfig) {
    this.provider = config.provider;
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;

    let baseURL = '';
    let headers = {};

    if (this.provider === AIProvidersEnum.OPEN_AI) {
      baseURL = 'https://api.openai.com/v1';
      headers = {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      };
    } else {
      baseURL = 'https://generativelanguage.googleapis.com/v1beta';
    }
    baseURL = this.baseUrl || baseURL;

    this.axiosInstance = axios.create({
      baseURL,
      headers,
    });
  }

  async getModelList(): Promise<{ id: string }[]> {
    try {
      const endpoint = '/models';
      let response: ModelListResponse;

      if (this.provider === AIProvidersEnum.OPEN_AI) {
        response = await this.axiosInstance.get(endpoint);
        return response.data.data.map((model: Model) => ({
          id: model.id,
        })) as { id: string }[];
      } else {
        response = await this.axiosInstance.get(endpoint, {
          params: { key: this.apiKey },
        });
        return response.data.models.map((model: Model) => ({
          id: model.name ?? '',
        }));
      }
    } catch (error) {
      throw new Error(`Error fetching model list: ${error}`);
    }
  }

  async executePrompt(
    model: string,
    temperature: number,
    systemPrompt: string,
    prompt: string,
    targetFields: string,
    promptTargetText: string,
  ) {
    try {
      let response: ExecutePromptResponse;

      if (this.provider === AIProvidersEnum.OPEN_AI) {
        response = await this.axiosInstance.post('/chat/completions', {
          model,
          messages: [
            { role: 'developer', content: systemPrompt },
            {
              role: 'user',
              content: ` ${prompt}
                Please refer to the following data for the ${targetFields} 
                fields: ${promptTargetText}
              `,
            },
          ],
        });
        return response.data.choices[0].message.content;
      } else {
        response = await this.axiosInstance.post(
          `/models/${model}:generateContent`,
          {
            systemInstruction: {
              parts: [
                {
                  text: systemPrompt,
                },
              ],
            },
            contents: [
              {
                parts: [
                  {
                    text: ` ${prompt}
                      Please refer to the following data for the ${targetFields} 
                      fields: ${promptTargetText}
                    `,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: temperature,
            },
          },
          {
            params: { key: this.apiKey },
          },
        );
      }

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      return `Error executing prompt: ${error}`;
    }
  }
}
