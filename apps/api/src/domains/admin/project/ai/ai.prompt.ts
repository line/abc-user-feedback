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
The following is a specially entered System Prompt by the user, which must also be considered when responding.

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
  existingIssues: string,
): string {
  return `
## Instructions
IMPORTANT: If an Additional User Prompt exists, it must be followed first.
IMPORTANT: Respond with the results of the AI Issue recommendation based on the following descriptions, feedback, and existing issues.
IMPORTANT: When responding, return only the text format of the recommended Issues, excluding any unnecessary information such as special characters.
IMPORTANT: If there are multiple issues, separate them with a comma (,), and the language of all the letters in the issues that are printed in response must be consistent.
IMPORTANT: Ensure each response value separated by a comma is no longer than 30 characters.
IMPORTANT: Please recommend between 2 and 3 issues, but with high accuracy, preferably many non-overlapping issues.

## Feedback Field Structure
The concept of a "Field" refers to each attribute of the feedback. Each field has a key, name, and description. The "key" is the unique key value of the field when receiving feedback input, the "name" is the name of the field referenced by the user, and the "description" is an explanation of the field.

For example, fields can be defined as follows, and feedback can be input as follows:

\`\`\`
Fields:
[
  { key: "os", name: "device_os", description: "operating system of app" },
  { key: "message",name: "message", description: "Contents of feedback" }
]

Feedback: { "os": "IOS", "message": "The app is not opened"}
\`\`\`

## Feedback and Issue
An "Issue" is used within ABC User Feedback for the purpose of managing "Feedback" by assigning them. An "Issue" can have a name, description, and status. The "name" signifies the name of the issue, summarizing the feedback to express what issue it is when assigned to the feedback. The "description" is an explanation of the issue, and the "status" can be states such as "INIT", "IN_PROGRESS", "RESOLVED".

For example, there can be an Issue related to Feedback as follows. In this example, there is only one issue per feedback, but feedback and issues can have an n:m relationship.

\`\`\`
Feedback: { "os": "IOS", "message": "When I've tried to login, I got an error message."}

Issue: { "name": "Login Issue", "description": "The user could not login." }
\`\`\`

## AI Issue Recommend
The AI Issue Recommend feature automatically recommends an Issue to be assigned to Feedback when User Feedback, Core User Prompt, and Existing Issues are input. Focus on analyzing the content of the Feedback, but reflect the contents of the Core User Prompt in the response.

Here is an example of a recommended Issue when Feedback is input. Even if the Feedback is long, it should be possible to summarize it into a core issue, and if it can be assigned to an already existing issue in the Existing Issues, prioritize recommending that instead of creating a new issue.

## Feedback
The following is the feedback content that is the target of the AI Issue Recommend.
${targetFeedback}

## Additional User Prompt
IMPORTANT: ${additionalPrompt}

## Existing Issues
The following is a list of issues that already exist within the service. If it can be assigned to an already existing issue, prioritize recommending that, and if not, recommend a new issue.
${existingIssues}
 `.trim();
}
