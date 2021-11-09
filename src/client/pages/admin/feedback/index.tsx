/* */
import React, { useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

/* */
import styles from './styles.module.scss'
import AdminPageContainer from '~/containers/AdminPageContainer'
import { Button, Table } from '~/components'
import { getFeedbacks } from '~/service/feedback'
import { Pagination, SIZE as PaginationSize } from 'baseui/pagination'

const AdminFeedbackPage = () => {
  const { isLoading, isError, error, data } = useQuery(
    'feedbacks',
    getFeedbacks
  )
  const router = useRouter()

  const [currentPage, setCurrentPage] = useState(1)

  const handleClickCreate = async () => {
    await router.push('/admin/feedback/create')
  }

  const tableColumns = useMemo(
    () => [
      {
        Header: 'Code',
        accessor: 'code'
      },
      {
        Header: 'Title',
        accessor: 'title'
      },
      {
        Header: 'Total Response',
        accessor: 'responses'
      },
      {
        Header: 'Created Time',
        accessor: 'createdTime'
      },
      {
        Header: 'Created By',
        accessor: 'user',
        Cell: ({ value }) => value?.profile?.nickname ?? ''
      }
    ],
    []
  )

  const handleRowClick = async (row) => {
    await router.push(`/admin/feedback/${row.code}`)
  }

  if (isError) {
    throw new Error(error.toString())
  }

  return (
    <AdminPageContainer title='Feedback'>
      <div className={styles.page}>
        <div className={styles.page__action}>
          <Button onClick={handleClickCreate}>Create Feedback</Button>
        </div>
        <div className={styles.page__list}>
          <Table
            data={data?.items ?? []}
            columns={tableColumns}
            loading={isLoading}
            onRowClick={handleRowClick}
          />
          <Pagination
            numPages={Math.floor((data?.totalCount ?? 0) / 100) + 1}
            size={PaginationSize.compact}
            currentPage={currentPage}
            onPageChange={({ nextPage }) => {
              setCurrentPage(Math.min(Math.max(nextPage, 1), 20))
            }}
          />
        </div>
      </div>
    </AdminPageContainer>
  )
}

export const getServerSideProps = async ({ query }) => {
  const locale = query?.service?.locale || 'en'
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common']))
    }
  }
}

export default AdminFeedbackPage
