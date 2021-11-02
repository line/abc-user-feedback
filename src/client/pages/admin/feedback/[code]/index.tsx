/* */
import React, { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useSnackbar } from 'baseui/snackbar'
import { Check, Delete, ArrowUp, ArrowDown } from 'baseui/icon'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { DateTime } from 'luxon'
import sortBy from 'lodash/sortBy'
import { TableBuilder, TableBuilderColumn } from 'baseui/table-semantic'
import { Checkbox } from 'baseui/checkbox'
import { ButtonGroup, SIZE as ButtonGroupSize } from 'baseui/button-group'
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
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

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

const REQUEST_COUNT = 100

const AdminFeedbackDetailPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { enqueue } = useSnackbar()
  const [showDeleteResponseModal, toggleDeleteResponseModal] = useToggle()
  const [showResponseDetailModal, toggleResponseDetailModal] = useToggle()
  const [showLatest, toggleShowLatest] = useToggle(true)

  const { t } = useTranslation()

  const [selectedId, setSelectedId] = useState<Array<string>>([])
  const [responseDetail, setResponseDetail] = useState<any>()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [params, setParams] = useState<any>({})

  const { user } = useUser()

  const { isLoading: isFeedbackLoading, data: feedback } = useQuery(
    ['feedback', router.query.code],
    getFeedbackByCode
  )

  const { isLoading: isFeedbackResponseLoading, data: response } = useQuery(
    ['responses', router.query.code, currentPage, params, showLatest],
    () =>
      getFeedbackreponses(router.query.code, {
        ...params,
        order: showLatest ? 'DESC' : 'ASC',
        offset: (currentPage - 1) * REQUEST_COUNT,
        limit: REQUEST_COUNT
      })
  )

  const [showExampleModal, setShowExampleModal] = useState<boolean>(false)

  const responseData = useMemo(() => {
    return response?.items ?? []
  }, [response])

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

  const handleRequestExcelExport = async (type: string) => {
    try {
      const code = router.query.code as string
      await exportFeedbackResponse(code, type)
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

  const renderDateHeader = useMemo(() => {
    return (
      <div
        onClick={toggleShowLatest}
        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
      >
        <span>date</span>
        {showLatest ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
      </div>
    )
  }, [showLatest])

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.page}>
        <h1 className={styles.title}>
          {user.role >= 3 && (
            <BackIcon
              className={styles.title__icon}
              onClick={handleClickBack}
            />
          )}
          <span className={styles.title__text}>
            {t('title.feeback.detail')}
          </span>
          {user.role >= 3 && (
            <div className={styles.title__action}>
              <ButtonGroup>
                <Button
                  onClick={handleToggleResponseExampleModal}
                  kind={KIND.secondary}
                  size={SIZE.compact}
                >
                  Response snippet
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
          )}
        </h1>
        <div className={styles.filter}>
          <ResponseFilter
            feedback={feedback}
            onApply={(params) => setParams(params)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>{response?.totalCount ?? 0}</div>
          {user.role >= 3 && (
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
          )}
        </div>
        <div className={styles.page__list}>
          <TableBuilder
            data={responseData}
            isLoading={isFeedbackLoading || isFeedbackResponseLoading}
            emptyMessage={<h1>No data</h1>}
          >
            {user.role >= 3 && (
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
            )}
            <TableBuilderColumn
              header='no.'
              numeric
              overrides={{
                TableHeadCell: { style: { width: '20px' } },
                TableBodyCell: { style: { width: '20px' } }
              }}
            >
              {(row, idx) => REQUEST_COUNT * (currentPage - 1) + idx + 1}
            </TableBuilderColumn>
            <TableBuilderColumn
              header={renderDateHeader}
              overrides={{
                TableHeadCell: { style: { width: '200px' } },
                TableBodyCell: { style: { width: '200px' } }
              }}
            >
              {(row) =>
                DateTime.fromISO(row.createdTime).toFormat('yyyy-MM-dd, HH:mm')
              }
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
              <ButtonGroup size={ButtonGroupSize.compact}>
                <Button
                  onClick={() => handleRequestExcelExport('xlsx')}
                  disabled={!responseData.length}
                >
                  {t('action.download.excel')}
                </Button>
                <Button
                  onClick={() => handleRequestExcelExport('csv')}
                  disabled={!responseData.length}
                >
                  {t('action.download.csv')}
                </Button>
              </ButtonGroup>
            )}
            <div style={{ marginLeft: 'auto' }}>
              <Pagination
                numPages={
                  response?.totalCount
                    ? Math.floor(response?.totalCount / REQUEST_COUNT) + 1
                    : 1
                }
                size={PaginationSize.compact}
                currentPage={currentPage}
                onPageChange={({ nextPage }) => {
                  setCurrentPage(nextPage)
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
        closeable
        onClose={toggleResponseDetailModal}
        role={ROLE.dialog}
      >
        <ModalHeader>{t('title.feeback.detail')}</ModalHeader>
        <ModalBody>
          <pre>{renderResponseDetail}</pre>
        </ModalBody>
      </Modal>
    </div>
  )
}

export const getServerSideProps = async ({ query }) => {
  return {
    props: {
      ...(await serverSideTranslations(query.service.locale, ['common']))
    }
  }
}

export default AdminFeedbackDetailPage
