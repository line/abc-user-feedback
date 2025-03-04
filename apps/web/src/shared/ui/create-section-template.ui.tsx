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

import { AccordionContent, AccordionItem, AccordionTrigger } from '@ufb/react';

interface IProps extends React.PropsWithChildren {
  title: string;
  defaultOpen?: boolean;
}

const CreateSectionTemplate: React.FC<IProps> = ({ title, children }) => {
  return (
    <AccordionItem
      value={title}
      className="border-neutral-tertiary mb-4 rounded border"
    >
      <AccordionTrigger className="bg-neutral-tertiary">
        {title}
      </AccordionTrigger>
      <AccordionContent className="overflow-auto">{children}</AccordionContent>
    </AccordionItem>
  );
};

export default CreateSectionTemplate;
