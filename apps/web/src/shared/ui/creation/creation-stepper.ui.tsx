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

import { cn } from '@/shared/utils';

interface Props {
  steps: string[];
  currentStepIndex: number;
  stepTitle: Record<string, React.ReactNode>;
}

const CreationStepper: React.FC<Props> = ({
  steps,
  currentStepIndex,
  stepTitle,
}) => {
  return (
    <div>
      {steps.map((step, i) => (
        <div key={i} className="relative">
          <div className="relative z-10 flex gap-4 pb-8">
            <div
              className={cn(
                'bg-neutral-secondary flex h-8 w-8 items-center justify-center rounded-full',
                { 'bg-black': i <= currentStepIndex },
              )}
            >
              <span className="text-white">{i + 1}</span>
            </div>
            <div>
              <p className="text-large-strong">Step {i + 1}</p>
              <p className="text-neutral-tertiary">{stepTitle[step]}</p>
            </div>
          </div>
          {i !== steps.length - 1 && (
            <div
              className={cn(
                'border-neutral-tertiary absolute left-[15px] top-0 z-0 mt-5 h-16 border-l-2',
                { 'border-black': i <= currentStepIndex },
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CreationStepper;
