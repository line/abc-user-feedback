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
import { Logger } from '@nestjs/common';
import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

import { AIProvidersEnum } from '@/common/enums/ai-providers.enum';
import { getRefinedSystemPrompt, getRefinedUserPrompt } from './ai.prompt';

interface AIClientConfig {
  apiKey: string;
  provider: AIProvidersEnum;
  baseUrl?: string;
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
    usage: { total_tokens: number };
    usageMetadata: {
      totalTokenCount: number;
    };
  };
}

class PromptResult {
  status: 'success' | 'error' = 'success';
  content: string;
  usedTokens: number;
}

export class AIClient {
  private logger = new Logger(AIClient.name);
  private axiosInstance: AxiosInstance;
  private provider: AIProvidersEnum;
  private apiKey: string;
  private baseUrl: string | undefined;

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

    if (this.baseUrl) baseURL = this.baseUrl;

    this.axiosInstance = axios.create({
      baseURL,
      headers,
    });
  }

  async validateAPIKey(): Promise<void> {
    try {
      let response: AxiosResponse;
      if (this.provider === AIProvidersEnum.OPEN_AI) {
        response = await this.axiosInstance.get('/models');
      } else {
        response = await this.axiosInstance.get('/models', {
          params: { key: this.apiKey },
        });
      }

      if (response.status !== 200) {
        throw new Error(`Invalid API key for ${this.provider}`);
      }
    } catch (error) {
      throw new Error(`Invalid API key for ${this.provider}: ${error}`);
    }
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
  ): Promise<PromptResult> {
    try {
      let response: ExecutePromptResponse;

      this.logger.log(
        `──────────────────── AI Prompt Execution ────────────────────`,
      );
      this.logger.log(getRefinedSystemPrompt(systemPrompt));
      this.logger.log(
        getRefinedUserPrompt(prompt, targetFields, promptTargetText),
      );

      if (this.provider === AIProvidersEnum.OPEN_AI) {
        response = await this.axiosInstance.post('/chat/completions', {
          model,
          messages: [
            {
              role: 'developer',
              content: getRefinedSystemPrompt(systemPrompt),
            },
            {
              role: 'user',
              content: getRefinedUserPrompt(
                prompt,
                targetFields,
                promptTargetText,
              ),
            },
          ],
        });
        const result = new PromptResult();
        result.content = response.data.choices[0].message.content;
        result.usedTokens = response.data.usage.total_tokens;

        return result;
      } else {
        response = await this.axiosInstance.post(
          `/models/${model}:generateContent`,
          {
            systemInstruction: {
              parts: [
                {
                  text: getRefinedSystemPrompt(systemPrompt),
                },
              ],
            },
            contents: [
              {
                parts: [
                  {
                    text: getRefinedUserPrompt(
                      prompt,
                      targetFields,
                      promptTargetText,
                    ),
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

      const result = new PromptResult();
      result.content = response.data.candidates[0].content.parts[0].text;
      result.usedTokens = response.data.usageMetadata.totalTokenCount;

      return result;
    } catch (error) {
      const result = new PromptResult();
      result.status = 'error';
      result.content = `Error executing prompt: ${error}`;
      result.usedTokens = 0;

      return result;
    }
  }
}
