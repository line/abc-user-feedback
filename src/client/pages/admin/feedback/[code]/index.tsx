/* */
import React, { useEffect, useMemo, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { useSnackbar } from 'baseui/snackbar'
import { Check, Delete } from 'baseui/icon'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import sortBy from 'lodash/sortBy'
import { ButtonGroup, SIZE as ButtonGroupSize } from 'baseui/button-group'
import { Button, KIND as ButtonKind, KIND, SIZE } from 'baseui/button'
import { Pagination, SIZE as PaginationSize } from 'baseui/pagination'
import {
  Modal,
  ModalButton,
  ModalFooter,
  ModalHeader,
  ROLE
} from 'baseui/modal'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

/* */
import styles from './styles.module.scss'
import BackIcon from '~/assets/back.svg'
import { useOAIQuery, useToggle, useUser } from '~/hooks'
import {
  deleteResponse,
  exportFeedbackResponse,
  getFeedbackreponses
} from '~/service/feedback'
import {
  FeedbackDetailModal,
  FeedbackResponseTable,
  Header,
  ResponseFilter,
  ResponseSnippetModal
} from '~/components'
import { Permission, Order } from '@/types'

const REQUEST_COUNT = 100

const AdminFeedbackDetailPage = (props) => {
  const router = useRouter()
  const [responseId, setResponseId] = useState<number>(null)

  const queryClient = useQueryClient()
  const { enqueue } = useSnackbar()

  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.includes('#modal-')) {
      const id = hash.replaceAll('#modal-', '')
      setResponseId(+id)
    }
  }, [])

  const idOrCode = useMemo<string>(() => {
    if (router?.query) {
      return router.query.code as string
    }

    return ''
  }, [router])

  const { isLoading: isFeedbackLoading, data: feedback } = useOAIQuery({
    queryKey: '/api/v1/admin/feedback/{idOrCode}',
    queryOptions: {
      enabled: !!idOrCode
    },
    variables: {
      idOrCode
    }
  })

  const [showDeleteResponseModal, toggleDeleteResponseModal] = useToggle()
  const [showExampleModal, setShowExampleModal] = useState<boolean>(false)

  const [showLatest, toggleShowLatest] = useToggle(true)

  const { t } = useTranslation()

  const [selectedId, setSelectedId] = useState<Array<number>>([])
  const [currentPage, setCurrentPage] = useState<number>(
    (props?.query?.page as number) ?? 1
  )
  const [params, setParams] = useState<any>({})

  const { hasPermission } = useUser()

  const { isLoading: isFeedbackResponseLoading, data: response } = useQuery(
    ['responses', idOrCode, currentPage, params, showLatest],
    () =>
      getFeedbackreponses(idOrCode, {
        ...params,
        order: showLatest ? Order.DESC : Order.ASC,
        offset: (currentPage - 1) * REQUEST_COUNT,
        limit: REQUEST_COUNT
      })
  )

  const numPages = useMemo<number>(() => {
    return response?.total ? Math.floor(response?.total / REQUEST_COUNT) + 1 : 1
  }, [response])

  const responseData = useMemo(() => {
    return response?.results ?? []
  }, [response])

  const responseColumns = useMemo(() => {
    return sortBy(feedback?.fields ?? [], (o) => o?.order).map(
      (field) => field.name
    ) as any
  }, [feedback])

  const handleToggleResponseDetailModal = async (id: number) => {
    if (!responseId) {
      window.history.pushState(null, null, `#modal-${id}`)
      setResponseId(id)
    } else {
      window.history.pushState(null, null, ' ')
      setResponseId(null)
    }
  }

  const handleSelectCheckbox = (ids: Array<number>) => {
    setSelectedId(ids)
  }

  const handleApplyFilter = async (params: Record<string, any>) => {
    setParams(params)
  }

  const handleToggleResponseExampleModal = () => {
    setShowExampleModal((s) => !s)
  }

  const handleRowClick = (e) => {
    const response = responseData[e.target.closest('tr').rowIndex - 1]

    if (response) {
      window.history.pushState(null, null, `#modal-${response.id}`)
      setResponseId(response.id)
    }
  }

  const handleClickBack = async () => {
    await router.push('/admin/feedback')
  }

  const handleClickEdit = async () => {
    await router.push(`/admin/feedback/${feedback.code}/edit`)
  }

  const handleRequestExcelExport = async (type: string) => {
    try {
      const code = router.query.code as string
      await exportFeedbackResponse(code, type, params)
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
        await Promise.all(
          selectedId.map((id) =>
            deleteResponse(router.query.code as string, id)
          )
        )

        queryClient.setQueryData(
          ['responses', router.query.code, currentPage, params, showLatest],
          ({ items = [], totalCount }) => {
            return {
              items: items?.filter?.(
                (response) => !selectedId.includes(response.id)
              ),
              totalCount: totalCount - 1
            }
          }
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

  const handlePageChange = async ({
    prevPage,
    nextPage
  }: {
    prevPage: number
    nextPage: number
  }) => {
    const page = Math.min(Math.max(+nextPage, 1), +numPages)
    await router.push(
      `/admin/feedback/${router.query.code}?page=${page}`,
      undefined,
      { shallow: true }
    )
    setCurrentPage(page)
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.page}>
        <h1 className={styles.title}>
          {hasPermission(Permission.READ_FEEDBACKS) && (
            <BackIcon
              className={styles.title__icon}
              onClick={handleClickBack}
            />
          )}
          <span className={styles.title__text}>
            {t('title.feedback.detail')}
          </span>
          {hasPermission(Permission.UPDATE_FEEDBACK) && (
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
          <ResponseFilter onApply={handleApplyFilter} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div>{response?.total ?? 0}</div>
          {hasPermission(Permission.DELETE_RESPONSE) && (
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
          <FeedbackResponseTable<any>
            loading={isFeedbackLoading || isFeedbackResponseLoading}
            data={responseData}
            selected={selectedId}
            colums={responseColumns}
            onSortToggle={toggleShowLatest}
            onSelect={handleSelectCheckbox}
            onRowClick={handleRowClick}
          />
          <div
            style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}
          >
            {hasPermission(Permission.EXPORT_RESPONSE) && (
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
                numPages={+numPages}
                size={PaginationSize.compact}
                currentPage={+currentPage}
                onPageChange={handlePageChange}
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
        animate
        autoFocus
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
      <FeedbackDetailModal
        id={responseId}
        show={!!responseId}
        onClose={handleToggleResponseDetailModal}
        feedback={feedback}
      />
    </div>
  )
}

export const getServerSideProps = async ({ query, req }) => {
  const locale = query?.service?.locale || 'en'

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  }
}

export default AdminFeedbackDetailPage
