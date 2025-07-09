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
## Instructions
IMPORTANT: Respond with the result of the AI Field based on the following descriptions, feedback, and field content. 
IMPORTANT: Return only the response value for the Core User Prompt in text format and exclude any unnecessary information.

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

export function getRefinedIssueRecommendationPrompt(
  targetFeedback: string,
  additionalPrompt: string,
  issueExamples: string,
  existingIssues: string,
): string {
  return `
## Instructions
IMPORTANT: 다음 설명들과 피드백과 이슈 예제들을 바탕으로 AI Issue 추천에 대한 결과를 응답해
IMPORTANT: 응답시 추천된 Issue들에 대한 응답값만을 text 형식으로 리턴하고 특수문자 등 나머지 불필요한 정보는 제외해.
IMPORTANT: 응답시 이슈가 여러개일 경우 comma(,)로 구분해서 응답해.
IMPORTANT: comma(,)로 구분된 각 응답값은 최대 20자가 되도록 해.
IMPORTANT: 만약 피드백이 제공되지 않았거나 추천할 Issue가 없다면 빈 스트링을 응답해.

## Feedback Field Structure

"Field"라는 개념은 각 feedback의 attribute를 의미해. 각 필드는 key, name, description을 가지고 있어. "key"는 피드백을 입력 받을 때 필드의 유일한 key 값을 의미하고, "name"은 유저가 참조하는 필드의 이름이고 "description"은 필드에 대한 설명이야. 

예를 들어 다음과 같이 field들이 정의될 수 있고 feedback이 입력 될 수 있어.

\`\`\`
Fields:
[
  { key: "os", name: "device_os", description: "operating system of app" },
  { key: "message",name: "message", description: "Contents of feedback" }
]

Feedback: { "os": "IOS", "message": "The app is not opened"}

\`\`\`

## Feedback and Issue
"Issue"는 ABC User Feedback 내부에서 "Feedback"들에 할당되어 관리하는 목적으로 사용 돼. "Issue"는 name, description, status를 가질 수 있어. "name"은 이슈의 이름을 의미하는데, 피드백에 할당될 때 피드백의 내용을 요약해서 어떤 이슈인지를 표현할 수 있어야 해. "description"은 이슈에 대한 설명이고 "status"는 이슈에 대한 상태인데 "INIT", "IN_PROGRESS", "RESOLVED" 등의 상태를 가질 수 있어. 

예를 들어 다음과 같이 Feedback과 관련된 Issue가 있을 수 있어. 다음 예제에서는 하나의 피드백에 하나의 이슈만 존재하지만 피드백과 이슈는 n:m관계가 될 수 있어.

\`\`\`
Feedback: { "os": "IOS", "message": "When I've tried to login, I got an error message."}

Issue: { "name": "Login Issue", "description": "The user could not login." }

\`\`\`

## AI Issue Recommend

AI Issue Recommend 기능은 유저의 Feedback과 Core User Prompt와 Issue Examples와 Existing Issues가 입력되었을 때 Feedback에 할당될 Issue를 자동으로 추천해주는 기능이야. Issue Example에는 현재 이 서비스에서 피드백들에 대해 할당된 이슈에 대한 정보가 있기 때문에 참고할 수 있어. Feedback의 내용을 중점적으로 분석하되 Core User Prompt의 내용을 반영해서 응답해.

다음은 Feedback이 입력되었을 때 추천되는 Issue의 예제야. Feedback이 길더라도 핵심적인 이슈로 요약이 가능해야 하고, Issue Examples를 참고하여 이미 존재하는 이슈 Existing Issues에 할당 가능할 경우 이슈를 생성하지 말고 그것을 우선적으로 추천해 줘.

\`\`\`
Feedback: { "os": "IOS", "message": "In order to check my account setting, I've tried to login with correct email and password, but It doesn't work. If it is possible, I want to change my password."}

Issues:
{ "name": "Login Issue", "description": "The user could not login." }
{ "name": "Password Change Issue", "description": "The user want to change the password" }

\`\`\`

## Feedback
다음은 AI Issue Recommend의 대상이 되는 피드백 내용이야.
${targetFeedback}

## Additional User Prompt
${additionalPrompt}

## Issue Examples
다음은 기존에 존재하는 이슈들의 예제야. 각 이슈의 name, description과 함께 어떤 피드백이 각 이슈에 할당되었는지 함께 제공돼.
${issueExamples}

## Existing Issues
다음은 이미 서비스 안에 존재하는 이슈들의 목록이야. 만약 이미 존재하는 이슈에 할당 가능할 경우 이슈를 생성하지 말고 그것을 우선적으로 추천하고, 그렇지 않을 경우 새로운 이슈를 추천해 줘.
${existingIssues}
 `.trim();
}
