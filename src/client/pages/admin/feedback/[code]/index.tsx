/* */
import React, { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useSnackbar } from 'baseui/snackbar'
import { Check, Delete } from 'baseui/icon'
import { useRouter } from 'next/router'
import { DateTime } from 'luxon'
import sortBy from 'lodash/sortBy'
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import { Checkbox } from 'baseui/checkbox'
import { ButtonGroup } from 'baseui/button-group'
import { ListItem, ListItemLabel } from 'baseui/list'
import { Button, KIND as ButtonKind, KIND, SIZE } from 'baseui/button'
import { Pagination, SIZE as PaginationSize } from 'baseui/pagination'
import {
  Modal,
  ModalButton,
  ModalFooter,
  ModalBody,
  ModalHeader,
  ROLE
} from 'baseui/modal'

/* */
import styles from './styles.module.scss'
import BackIcon from '~/assets/back.svg'
import { useToggle, useUser } from '~/hooks'
import {
  getFeedbackByCode,
  getFeedbackreponses,
  deleteResponse,
  exportFeedbackResponse
} from '~/service/feedback'
import { Header, ResponseSnippetModal, ResponseFilter } from '~/components'

const AdminFeedbackDetailPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { enqueue } = useSnackbar()
  const [showDeleteResponseModal, toggleDeleteResponseModal] = useToggle()
  const [responseDetail, setResponseDetail] = useState<any>()
  const [showResponseDetailModal, toggleResponseDetailModal] = useToggle()
  const [selectedId, setSelectedId] = useState<Array<string>>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [params, setParams] = useState<any>({})
  const { user } = useUser()

  const { isLoading: isFeedbackLoading, data: feedback } = useQuery(
    ['feedback', router.query.code],
    getFeedbackByCode
  )

  const { isLoading: isFeedbackResponseLoading, data: response } = useQuery(
    ['responses', router.query.code, currentPage, params],
    () =>
      getFeedbackreponses(router.query.code, {
        ...params,
        offset: (currentPage - 1) * 100,
        limit: 100
      })
  )

  const [showExampleModal, setShowExampleModal] = useState<boolean>(false)

  const responseColumns = useMemo(() => {
    return sortBy(feedback?.fields ?? [], (o) => o?.order).map(
      (field) => field.name
    ) as any
  }, [feedback])

  const handleToggleCheckbox = (e: any) => {
    const { checked, name } = e.currentTarget

    if (checked) {
      setSelectedId((s) => s.concat(name))
    } else {
      setSelectedId((s) => s.filter((id) => id !== name))
    }
  }

  const handleToggleResponseExampleModal = () => {
    setShowExampleModal((s) => !s)
  }

  const handleClickBack = async () => {
    await router.push('/admin/feedback')
  }

  const handleClickEdit = async () => {
    await router.push(`/admin/feedback/${feedback.code}/edit`)
  }

  const handleClickResponseDetail = (response: any) => {
    if (response) {
      setResponseDetail(response)
      toggleResponseDetailModal()
    }
  }

  const handleRequestExcelExport = async () => {
    try {
      const code = router.query.code as string
      await exportFeedbackResponse(code)
    } catch (error) {
      enqueue({
        message: error.toString(),
        startEnhancer: ({ size }) => <Delete size={size} />
      })
    }
  }

  const handleDeleteResponse = async () => {
    try {
      if (selectedId.length) {
        await Promise.all(selectedId.map((id) => deleteResponse(id)))

        queryClient.setQueryData(
          ['responses', router.query.code],
          (prev: Array<any> = []) =>
            prev.filter((response) => !selectedId.includes(response.id))
        )
        toggleDeleteResponseModal()

        enqueue({
          message: `Success delete ${selectedId.length} responses`,
          startEnhancer: ({ size }) => <Check size={size} />
        })
        setSelectedId([])
      }
    } catch (error) {
      enqueue({
        message: error.toString(),
        startEnhancer: ({ size }) => <Delete size={size} />
      })
    }
  }

  const renderResponseDetail = useMemo(() => {
    const itemElem = []

    if (responseDetail?.feedbackResponseFields) {
      const { feedbackResponseFields = [] } = responseDetail
      feedbackResponseFields.map((field) => {
        itemElem.push(
          <ListItem
            endEnhancer={() => <ListItemLabel>{field?.value}</ListItemLabel>}
          >
            <ListItemLabel>{field?.feedbackField?.name}</ListItemLabel>
          </ListItem>
        )
      })
    }

    return itemElem
  }, [feedback, responseDetail])

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.page}>
        <h1 className={styles.title}>
          <BackIcon className={styles.title__icon} onClick={handleClickBack} />
          <span className={styles.title__text}>Feedback Detail</span>
          <div className={styles.title__action}>
            <ButtonGroup>
              <Button
                onClick={handleToggleResponseExampleModal}
                kind={KIND.secondary}
                size={SIZE.compact}
              >
                Response form snippet
              </Button>
              <Button
                onClick={handleClickEdit}
                kind={KIND.secondary}
                size={SIZE.compact}
              >
                Edit
              </Button>
            </ButtonGroup>
          </div>
        </h1>
        <table className={styles.info}>
          <tbody>
            <tr>
              <th colSpan={1}>Code</th>
              <td colSpan={5}>{feedback?.code}</td>
            </tr>
            <tr>
              <th colSpan={1}>Feedback title</th>
              <td colSpan={5}>{feedback?.title}</td>
            </tr>
            <tr>
              <th colSpan={1}>Created Time</th>
              <td colSpan={3}>
                {DateTime.fromISO(feedback?.createdTime).toFormat(
                  'yyyy-MM-dd, HH:mm'
                )}
              </td>
              <th colSpan={1}>Created by</th>
              <td colSpan={3}>{feedback?.user?.profile?.nickname}</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.filter}>
          <ResponseFilter
            feedback={feedback}
            onApply={(params) => setParams(params)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>{response?.totalCount ?? 0}</div>
          <div style={{ marginLeft: 'auto' }}>
            <Button
              onClick={toggleDeleteResponseModal}
              kind={KIND.secondary}
              size={SIZE.compact}
              disabled={!selectedId.length}
            >
              Delete
            </Button>
          </div>
        </div>
        <div className={styles.page__list}>
          <TableBuilder
            data={response?.items ?? []}
            isLoading={isFeedbackLoading || isFeedbackResponseLoading}
          >
            <TableBuilderColumn
              overrides={{
                TableHeadCell: { style: { width: '1%' } },
                TableBodyCell: { style: { width: '1%' } }
              }}
            >
              {(row) => (
                <Checkbox
                  name={row.id}
                  checked={selectedId.includes(row.id)}
                  onChange={handleToggleCheckbox}
                />
              )}
            </TableBuilderColumn>
            <TableBuilderColumn header='Time'>
              {(row) =>
                DateTime.fromISO(row.createdTime).toFormat('yyyy-MM-dd, HH:mm')
              }
            </TableBuilderColumn>
            <TableBuilderColumn header='User'>
              {(row) => row?.user?.profile?.nickname ?? '-'}
            </TableBuilderColumn>
            {responseColumns.map((col) => (
              <TableBuilderColumn header={col} key={col}>
                {(row) =>
                  row.feedbackResponseFields.find(
                    (field) => field.feedbackField.name === col
                  )?.value
                }
              </TableBuilderColumn>
            ))}
            <TableBuilderColumn>
              {(row) => (
                <Button
                  onClick={() => handleClickResponseDetail(row)}
                  kind={KIND.tertiary}
                  size={SIZE.mini}
                >
                  Detail
                </Button>
              )}
            </TableBuilderColumn>
          </TableBuilder>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {user.role >= 2 && (
              <Button
                onClick={handleRequestExcelExport}
                kind={KIND.secondary}
                size={SIZE.compact}
                disabled={user.role < 2}
              >
                Excel Download
              </Button>
            )}
            <div style={{ marginLeft: 'auto' }}>
              <Pagination
                numPages={Math.floor(response?.totalCount ?? 0 / 100)}
                size={PaginationSize.compact}
                currentPage={currentPage}
                onPageChange={({ nextPage }) => {
                  setCurrentPage(Math.min(Math.max(nextPage, 1), 20))
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <ResponseSnippetModal
        isOpen={showExampleModal}
        feedback={feedback}
        onClose={handleToggleResponseExampleModal}
      />
      <Modal
        isOpen={showDeleteResponseModal}
        closeable={false}
        onClose={toggleDeleteResponseModal}
        size={SIZE.default}
        role={ROLE.dialog}
      >
        <ModalHeader>Delete {selectedId.length} Responses?</ModalHeader>
        <ModalFooter>
          <ModalButton
            onClick={toggleDeleteResponseModal}
            kind={ButtonKind.tertiary}
          >
            Cancel
          </ModalButton>
          <ModalButton onClick={handleDeleteResponse}>Confirm</ModalButton>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={showResponseDetailModal}
        size={SIZE.default}
        role={ROLE.dialog}
      >
        <ModalHeader>Response Detail</ModalHeader>
        <ModalBody>
          <pre>{renderResponseDetail}</pre>
        </ModalBody>
        <ModalFooter>
          <ModalButton onClick={toggleResponseDetailModal}>Confirm</ModalButton>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default AdminFeedbackDetailPage
