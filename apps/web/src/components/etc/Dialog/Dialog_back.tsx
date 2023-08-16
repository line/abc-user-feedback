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
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import { IIconProps, Icon } from '@ufb/ui';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

export interface IDialogProps extends React.PropsWithChildren {
  title: string;
  description?: string;
  open: boolean;
  close: () => void;
  submitButton?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  icon?: IIconProps;
}

const Dialog: React.FC<IDialogProps> = (props) => {
  const { title, description, children, open, submitButton, close, icon } =
    props;
  const { t } = useTranslation();

  const { refs, context } = useFloating({
    open,
    onOpenChange(open) {
      if (!open) close();
    },
  });

  const click = useClick(context);
  const dismiss = useDismiss(context, {
    outsidePressEvent: 'mousedown',
  });
  const role = useRole(context);

  // Merge all the interactions into prop getters
  const { getFloatingProps } = useInteractions([click, dismiss, role]);

  // Set up label and description ids
  const labelId = useId();
  const descriptionId = useId();

  return (
    <>
      {open && (
        <FloatingPortal>
          <FloatingOverlay
            lockScroll
            className="bg-dim"
            style={{
              display: 'grid',
              placeItems: 'center',
              zIndex: 100,
            }}
          >
            <FloatingFocusManager context={context}>
              <div
                ref={refs.setFloating}
                aria-labelledby={labelId}
                aria-describedby={descriptionId}
                {...getFloatingProps()}
                className="bg-primary rounded p-5 min-w-[480px] border"
              >
                <h1 id={labelId} className="font-20-bold mb-4">
                  {title}
                </h1>
                {icon && (
                  <div className="text-center mb-6">
                    <Icon {...icon} />
                  </div>
                )}
                {description && (
                  <p
                    id={descriptionId}
                    className={[
                      'font-14-regular mb-10 whitespace-pre-line',
                      icon ? 'text-center' : '',
                    ].join(' ')}
                  >
                    {description}
                  </p>
                )}
                <div className="mb-5">{children}</div>
                <div className="flex justify-end gap-2">
                  <button className="btn btn-secondary" onClick={close}>
                    {t('button.cancel')}
                  </button>
                  {submitButton && (
                    <button
                      {...submitButton}
                      className={[
                        'btn btn-primary',
                        submitButton.className,
                      ].join(' ')}
                    />
                  )}
                </div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      )}
    </>
  );
};
export default Dialog;
