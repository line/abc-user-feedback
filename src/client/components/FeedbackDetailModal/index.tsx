/* */
import React, { useMemo } from 'react'
import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
  ModalHeader,
  ROLE,
  SIZE as ModalSize
} from 'baseui/modal'
import { ListItem, ListItemLabel } from 'baseui/list'
import { DateTime } from 'luxon'
import sortBy from 'lodash/sortBy'
import { KIND as ButtonKind } from 'baseui/button'
import { useTranslation } from 'next-i18next'
import { useSnackbar } from 'baseui/snackbar'
import { Check, Delete } from 'baseui/icon'

/* */
import { FormFieldType } from '@/types'
import { copyTextToClipboard } from '~/utils/text'
import CopyLinkIcon from '~/assets/copy_link.svg'

interface Props {
  feedback: any
  responseDetail: any
  show: boolean
  onClose: (...args: any) => any
}

const FeedbackDetailModal = (props: Props) => {
  const { feedback, responseDetail, show = false, onClose } = props

  const { t } = useTranslation()
  const { enqueue } = useSnackbar()

  const handleCopyLink = async () => {
    try {
      await copyTextToClipboard(window.location.href)
      enqueue({
        message: 'Success copy to clipboard',
        startEnhancer: ({ size }) => <Check size={size} />
      })
    } catch {
      enqueue({
        message: 'Error from copy',
        startEnhancer: ({ size }) => <Delete size={size} />
      })
    }
  }

  const renderResponseDetail = useMemo(() => {
    const itemElem = []

    if (responseDetail?.feedbackResponseFields) {
      const { feedbackResponseFields = [], id, createdTime } = responseDetail

      itemElem.push(
        <ListItem
          overrides={{
            EndEnhancerContainer: {
              style: {
                maxWidth: '640px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }
            }
          }}
          endEnhancer={() => <ListItemLabel>{id}</ListItemLabel>}
        >
          <ListItemLabel
            overrides={{
              LabelContent: {
                style: {
                  minWidth: '200px'
                }
              }
            }}
          >
            No.
          </ListItemLabel>
        </ListItem>,
        <ListItem
          overrides={{
            EndEnhancerContainer: {
              style: {
                maxWidth: '640px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }
            }
          }}
          endEnhancer={() => (
            <ListItemLabel>
              {DateTime.fromISO(createdTime, { zone: 'utc' }).toFormat(
                'yyyy-MM-dd HH:mm'
              )}
            </ListItemLabel>
          )}
        >
          <ListItemLabel
            overrides={{
              LabelContent: {
                style: {
                  minWidth: '200px'
                }
              }
            }}
          >
            Date
          </ListItemLabel>
        </ListItem>
      )

      const sorted = sortBy(feedbackResponseFields, (response) => {
        return feedback?.fields.find(
          (f) => f.name === response.feedbackField.name
        )?.order
      })

      sorted.map((field) => {
        itemElem.push(
          <ListItem
            overrides={{
              EndEnhancerContainer: {
                style: {
                  maxWidth: '640px',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all'
                }
              }
            }}
            endEnhancer={() => {
              const value =
                field.feedbackField.type === FormFieldType.Select
                  ? field.feedbackField.options.find(
                      (option) => option.value === field.value
                    )?.label
                  : field.value
              return <ListItemLabel>{value}</ListItemLabel>
            }}
          >
            <ListItemLabel
              overrides={{
                LabelContent: {
                  style: {
                    minWidth: '200px'
                  }
                }
              }}
            >
              {field?.feedbackField?.name}
            </ListItemLabel>
          </ListItem>
        )
      })
    }

    return itemElem
  }, [feedback, responseDetail])

  return (
    <Modal
      isOpen={show}
      size={ModalSize.auto}
      closeable={false}
      role={ROLE.dialog}
    >
      <ModalHeader>{t('title.feedback.detail')}</ModalHeader>
      <ModalBody>
        <pre>{renderResponseDetail}</pre>
      </ModalBody>
      <ModalFooter style={{ display: 'flex', alignItems: 'center' }}>
        <ModalButton
          kind={ButtonKind.tertiary}
          onClick={handleCopyLink}
          overrides={{
            BaseButton: {
              style: ({ $theme }) => ({
                color: $theme.colors.primary500,
                fill: $theme.colors.primary500
              })
            }
          }}
        >
          <CopyLinkIcon
            style={{
              width: '24px',
              height: '24px',
              fill: 'inherit',
              marginRight: '8px'
            }}
          />
          Copy link
        </ModalButton>
        <ModalButton
          kind={ButtonKind.primary}
          onClick={onClose}
          overrides={{
            BaseButton: {
              style: {
                marginLeft: 'auto'
              }
            }
          }}
        >
          {t('action.confirm')}
        </ModalButton>
      </ModalFooter>
    </Modal>
  )
}

export default FeedbackDetailModal
