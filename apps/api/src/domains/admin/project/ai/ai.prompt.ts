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

export function getRefinedSystemPrompt(systemPrompt: string): string {
  return `This prompt is used in a service where user feedback can be received and reviewed. The received feedback can be used for summarization, translation, analysis, etc.
  ${systemPrompt.trim()}`;
}

export function getRefinedUserPrompt(
  prompt: string,
  targetFields: string,
  promptTargetText: string,
): string {
  return `In user feedback, there is a concept called 'field', which is an attribute of each feedback. Each field has a unique key, value, and description, and the value is in the form of a format. Specifically, in this prompt, we will process the information using the ${targetFields}. ${prompt} 
  
  The following content provides specific details about the target fields included in the feedback. 
  ${promptTargetText}

  And unless there are specific instructions, the language of the response should follow the target field.`;
}
