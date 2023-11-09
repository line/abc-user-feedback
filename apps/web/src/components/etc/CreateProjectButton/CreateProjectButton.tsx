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
import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import {
  arrow,
  autoUpdate,
  flip,
  FloatingArrow,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';

import { Icon, Popover, PopoverModalContent } from '@ufb/ui';

import { Path } from '@/constants/path';
import { PROJECT_STEPS } from '@/contexts/create-project.context';
import { useLocalStorage } from '@/hooks';

interface IProps {
  hasProject?: boolean;
}

const CreateProjectButton: React.FC<IProps> = ({ hasProject }) => {
  const arrowRef = useRef(null);
  const [state] = useLocalStorage(`project completeStepIndex`, 0);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(16),
      flip({ fallbackAxisSideDirection: 'start' }),
      shift(),
      arrow({ element: arrowRef }),
    ],
  });

  const hover = useHover(context, { move: false });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ]);

  return (
    <>
      <button
        className="btn btn-lg btn-primary w-[200px] gap-2"
        ref={refs.setReference}
        {...getReferenceProps()}
        onClick={() => {
          if (state > 0) setOpen(true);
          else router.push(Path.CREATE_PROJECT);
        }}
      >
        <Icon name="Plus" className="text-above-white" />
        Project 생성
      </button>
      {(!hasProject || (hasProject && state > 0)) && (
        <FloatingPortal>
          <div
            className={`${
              !hasProject ? 'bg-blue-quaternary' : 'bg-red-quaternary'
            } rounded px-3 py-2`}
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            <p
              className={`${
                !hasProject ? 'text-blue-primary' : 'text-red-primary'
              } font-12-regular`}
            >
              {!hasProject && '등록된 프로젝트가 없습니다.'}
              {hasProject && state > 0 && (
                <>
                  생성중인 Project가 있습니다.{' '}
                  <b>
                    {state + 1}/{PROJECT_STEPS.length}
                  </b>
                </>
              )}
            </p>
            <FloatingArrow
              ref={arrowRef}
              context={context}
              fill={!hasProject ? '#007AFF1A' : '#F429001A'}
            />
          </div>
        </FloatingPortal>
      )}
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverModalContent
          title="이어서 생성하시겠어요?"
          description="현재 생성중인 Project가 있습니다. 이어서 생성하시겠어요? (처음부터 하면 기존 정보는 사라집니다.)"
          submitButton={{
            children: '이어서하기',
            className: 'btn-red',
            onClick: () => router.push(Path.CREATE_PROJECT),
          }}
          cancelButton={{
            children: '처음부터',
            onClick: () => {
              localStorage.removeItem('project input');
              localStorage.removeItem('project currentStep');
              localStorage.removeItem('project completeStepIndex');
              router.push(Path.CREATE_PROJECT);
            },
          }}
        />
      </Popover>
    </>
  );
};

export default CreateProjectButton;
