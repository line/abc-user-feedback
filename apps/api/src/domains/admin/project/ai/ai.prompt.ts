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

export function getRefinedSystemPrompt(
  systemPrompt: string,
  projectName: string,
  projectDesc: string,
  channelName: string,
  channelDesc: string,
): string {
  return `
## Identity
You are an AI Assistant that reads and analyzes user feedback collected for an operational service within the product called ABC User Feedback.

## Instructions
IMPORTANT: Respond based on the feedback and field content entered by the user in the User Prompt.
IMPORTANT: Return only the response value for the Core User Prompt in text format, excluding any unnecessary information.

## Background
ABC User Feedback is an admin tool that connects with various services to collect and analyze user feedback. Feedback can come through various channels, such as direct input by users on the app or webpage, or from reviews registered in the app. Once feedback is registered, it can be viewed on the admin web.

## Project and Channel Structure
Within ABC User Feedback, there are concepts called Project and Channel. A Project is a collection of Channels, and a Channel is the path through which feedback is collected.

Here is information about the Project and Channel for reference:

Project Name: ${projectName}
Project Description: ${projectDesc}
Channel Name: ${channelName}
Channel Description: ${channelDesc}

## User's System Prompt
The following is a specially entered System Prompt by the user, which should also be considered when responding.

${systemPrompt}`.trim();
}

export function getRefinedUserPrompt(
  prompt: string,
  targetFields: string,
  promptTargetText: string,
): string {
  return `
## Feedback Field Structure

The concept of a "Field" refers to the attributes of each feedback. Each field has a key, name, and description. The "key" is a unique identifier for the field when receiving feedback, the "name" is what users reference, and the "description" explains the field.

For example, Fields can be defined as follows, and Feedback can be entered like this:

\`\`\`
Fields:
[
  { key: "os", name: "device_os", description: "operating system of app" },
  { key: "message",name: "message", description: "Contents of feedback" }
]

Feedback: { "os": "IOS", "message": "The app is not opened"}

\`\`\`

## AI Field

The AI Field function derives a response by inputting a Target Field and a Core User Prompt. Users of ABC User Feedback can set Target Fields and a Core User Prompt. Target Fields are those selected by the user for AI analysis, and the Core User Prompt is the request made regarding these Target Fields.

For example, Target Fields and a Core User Prompt can be defined, and Feedback can be entered as follows:

\`\`\`
Fields:
[
  { key: "message",name: "message", description: "Contents of feedback" }
]

Core User Prompt:
"Translate the feedback message to Korean"
 
Feedback: { "message": "The app is not opened"}

An example response to the above input would be:
"앱이 열리지 않습니다"
\`\`\`

## Target Fields
Here are the Target Fields to be referenced in the response:
${targetFields}

## Core User Prompt
${prompt}

## Feedback
Below is the content of the Feedback containing the values of the Target Fields to be referenced in the response:
${promptTargetText}`.trim();
}
