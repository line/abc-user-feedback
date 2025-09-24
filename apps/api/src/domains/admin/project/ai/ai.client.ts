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
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Logger } from '@nestjs/common';
import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

import { AIPromptStatusEnum } from '@/common/enums/ai-prompt-status.enum';
import { AIProvidersEnum } from '@/common/enums/ai-providers.enum';
import {
  getRefinedIssueRecommendationPrompt,
  getRefinedSystemPrompt,
  getRefinedUserPrompt,
} from './ai.prompt';

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
  status: number;
  data: {
    choices: { message: { content: string } }[];
    candidates: { content: { parts: { text: string }[] } }[];
    usage: { total_tokens: number };
    usageMetadata: {
      totalTokenCount: number;
    };
  };
}

interface ErrorResponse {
  status: number;
}

export class PromptParameters {
  model: string;
  temperature: number;
  systemPrompt: string;
  prompt: string;
  targetFields: string;
  promptTargetText: string;
  projectName: string;
  projectDesc: string;
  channelName: string;
  channelDesc: string;

  constructor(
    model: string,
    temperature: number,
    systemPrompt: string,
    prompt: string,
    targetFields: string,
    promptTargetText: string,
    projectName: string,
    projectDesc: string,
    channelName: string,
    channelDesc: string,
  ) {
    this.model = model;
    this.temperature = temperature;
    this.systemPrompt = systemPrompt;
    this.prompt = prompt;
    this.targetFields = targetFields;
    this.promptTargetText = promptTargetText;
    this.projectName = projectName;
    this.projectDesc = projectDesc;
    this.channelName = channelName;
    this.channelDesc = channelDesc;
  }
}

export class IssueRecommendParameters {
  model: string;
  temperature: number;
  systemPrompt: string;
  targetFeedback: string;
  additionalPrompt: string;
  existingIssues: string;
  projectName: string;
  projectDesc: string;
  channelName: string;
  channelDesc: string;

  constructor(
    model: string,
    temperature: number,
    systemPrompt: string,
    targetFeedback: string,
    additionalPrompt: string,
    existingIssues: string,
    projectName: string,
    projectDesc: string,
    channelName: string,
    channelDesc: string,
  ) {
    this.model = model;
    this.temperature = temperature;
    this.systemPrompt = systemPrompt;
    this.targetFeedback = targetFeedback;
    this.additionalPrompt = additionalPrompt;
    this.existingIssues = existingIssues;
    this.projectName = projectName;
    this.projectDesc = projectDesc;
    this.channelName = channelName;
    this.channelDesc = channelDesc;
  }
}

class PromptResult {
  status: AIPromptStatusEnum = AIPromptStatusEnum.success;
  statusCode: number;
  content: string;
  usedTokens: number;
}

const MAX_RETRY_COUNT = 3;

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
          id: model.name?.replace('models/', '') ?? '',
        }));
      }
    } catch (error) {
      throw new Error(`Error fetching model list: ${error}`);
    }
  }

  async executePrompt(params: PromptParameters): Promise<PromptResult> {
    for (let retryCount = 0; retryCount < MAX_RETRY_COUNT; retryCount++) {
      const result = await this.executePromptInternal(params);

      if (result.statusCode === 429) {
        this.logger.log(
          `Rate limit exceeded. Retrying... (${retryCount + 1}/${MAX_RETRY_COUNT})`,
        );
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * (retryCount + 1)),
        );
      } else {
        return result;
      }
    }

    const result = new PromptResult();
    result.status = AIPromptStatusEnum.error;
    result.content = `Failed to execute prompt after ${MAX_RETRY_COUNT} attempts.`;
    result.usedTokens = 0;
    result.statusCode = 500;
    return result;
  }

  async executePromptInternal(params: PromptParameters): Promise<PromptResult> {
    let response: ExecutePromptResponse = {} as ExecutePromptResponse;
    try {
      const systemPrompt = getRefinedSystemPrompt(
        params.systemPrompt,
        params.projectName,
        params.projectDesc,
        params.channelName,
        params.channelDesc,
      );

      const userPrompt = getRefinedUserPrompt(
        params.prompt,
        params.targetFields,
        params.promptTargetText,
      );

      this.logger.log(
        `──────────────────── AI Prompt Execution ────────────────────`,
      );
      this.logger.log('System Prompt');
      this.logger.log(systemPrompt);
      this.logger.log('User Prompt');
      this.logger.log(userPrompt);

      if (this.provider === AIProvidersEnum.OPEN_AI) {
        response = await this.axiosInstance.post('/chat/completions', {
          model: params.model,
          messages: [
            {
              role: 'developer',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
          temperature: params.temperature,
        });
        const result = new PromptResult();
        result.content = response.data.choices[0].message.content;
        result.usedTokens = response.data.usage.total_tokens;
        result.statusCode = response.status;

        return result;
      } else {
        response = await this.axiosInstance.post(
          `/models/${params.model}:generateContent`,
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
                    text: userPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: params.temperature * 2,
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
      result.statusCode = response.status;

      return result;
    } catch (error) {
      const result = new PromptResult();
      result.status = AIPromptStatusEnum.error;

      const errorMessage: string =
        (error?.response?.data?.error?.message as string) ||
        (error?.message as string) ||
        'Unknown error';

      result.content = `Error executing prompt: ${errorMessage}`;
      result.usedTokens = 0;
      result.statusCode = (error as ErrorResponse).status || 500;

      return result;
    }
  }

  async executeIssueRecommend(params: IssueRecommendParameters) {
    let response: ExecutePromptResponse = {} as ExecutePromptResponse;
    try {
      const systemPrompt = getRefinedSystemPrompt(
        params.systemPrompt,
        params.projectName,
        params.projectDesc,
        params.channelName,
        params.channelDesc,
      );

      const userPrompt = getRefinedIssueRecommendationPrompt(
        params.targetFeedback,
        params.additionalPrompt,
        params.existingIssues,
      );

      this.logger.log(
        `──────────────────── AI Issue Recommendation Execution ────────────────────`,
      );
      this.logger.log('System Prompt');
      this.logger.log(systemPrompt);
      this.logger.log('User Prompt');
      this.logger.log(userPrompt);

      if (this.provider === AIProvidersEnum.OPEN_AI) {
        response = await this.axiosInstance.post('/chat/completions', {
          model: params.model,
          messages: [
            {
              role: 'developer',
              content: systemPrompt,
            },
            {
              role: 'user',
              content: userPrompt,
            },
          ],
          temperature: params.temperature,
        });
        const result = new PromptResult();
        result.content = response.data.choices[0].message.content;
        result.usedTokens = response.data.usage.total_tokens;
        result.statusCode = response.status;

        return result;
      } else {
        response = await this.axiosInstance.post(
          `/models/${params.model}:generateContent`,
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
                    text: userPrompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: params.temperature * 2,
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
      result.statusCode = response.status;

      return result;
    } catch (error) {
      const result = new PromptResult();
      result.status = AIPromptStatusEnum.error;

      const errorMessage: string =
        (error?.response?.data?.error?.message as string) ||
        (error?.message as string) ||
        'Unknown error';

      result.content = `Error executing prompt: ${errorMessage}`;
      result.usedTokens = 0;
      result.statusCode = (error as ErrorResponse).status || 500;

      return result;
    }
  }
}
