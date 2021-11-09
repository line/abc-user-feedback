/* */
import React, { useMemo, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useSnackbar } from 'baseui/snackbar'
import { Check, Delete } from 'baseui/icon'
import { useQuery } from 'react-query'
import { KIND as ButtonKind } from 'baseui/button'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE
} from 'baseui/modal'

/* */
import styles from './styles.module.scss'
import { FeedbackForm, Button, FormItem } from '~/components'
import { AdminPageContainer } from '~/containers'
import { useToggle } from '~/hooks'
import {
  getFeedbackByCode,
  updateFeedback,
  deleteFeedback
} from '~/service/feedback'
import { parseValidateError } from '~/utils/error'

const EditFeedbackPage = () => {
  const router = useRouter()
  const code = router.query.code as string
  const [showDeleteModal, setToggleDeleteModal] = useToggle(false)
  const { enqueue } = useSnackbar()
  const { isLoading, data } = useQuery(['feedback', code], getFeedbackByCode)

  const methods = useForm({
    defaultValues: {
      title: '',
      allowAnonymous: false,
      description: '',
      code: '',
      fields: []
    }
  })

  const { reset } = methods

  useEffect(() => {
    if (data) {
      reset(data)
    }
  }, [data])

  const { formState, getValues, trigger, setError } = methods
  const { isDirty } = formState

  const handleClickCancel = async () => {
    await router.push(`/admin/feedback/${code}`)
  }

  const handleUpdateFeedback = async () => {
    try {
      const result = await trigger()
      if (result) {
        const values = getValues()
        const data = await updateFeedback(code, {
          title: values.title,
          description: values.description,
          code: values.code
        })

        enqueue({
          message: 'Success update feedback',
          startEnhancer: ({ size }) => <Check size={size} />
        })
        await router.push(`/admin/feedback/${data?.code}`)
      }
    } catch (e) {
      const { original } = parseValidateError(e)

      setError('fields', {
        type: 'manual',
        message: original
      })
    }
  }

  const handleDeleteFeedback = async () => {
    try {
      await deleteFeedback(code)
      await router.push(`/admin/feedback`)
      enqueue({
        message: 'Success delete feedback',
        startEnhancer: ({ size }) => <Check size={size} />
      })
    } catch (error) {
      enqueue({
        message: error.toString(),
        startEnhancer: ({ size }) => <Delete size={size} />
      })
    }
  }

  const renderTitle = useMemo(() => {
    return (
      <div className={styles.title}>
        <span>Edit Feedback</span>
        <div className={styles.title__action}>
          <Button className={styles.title__action} onClick={handleClickCancel}>
            Cancel
          </Button>
          <Button
            className={styles.title__action__create}
            type='primary'
            disabled={!isDirty}
            onClick={handleUpdateFeedback}
          >
            Save
          </Button>
        </div>
      </div>
    )
  }, [isDirty])

  return (
    <AdminPageContainer title={renderTitle} className={styles.container}>
      <div className={styles.page}>
        <FormProvider {...methods}>
          <FeedbackForm isEdit />
        </FormProvider>
        <div className={styles.delete}>
          <FormItem
            label='Delete feedback'
            description='delete feedback and all of responses related with this feedback'
          >
            <Button
              className={styles.delete__button}
              onClick={setToggleDeleteModal}
            >
              Delete
            </Button>
          </FormItem>
        </div>
      </div>
      <Modal
        isOpen={showDeleteModal}
        closeable
        onClose={setToggleDeleteModal}
        size={SIZE.default}
        role={ROLE.dialog}
      >
        <ModalHeader>Delete feedback</ModalHeader>
        <ModalBody>
          Remove feedback, all of responses related with this feedback
        </ModalBody>
        <ModalFooter>
          <ModalButton
            onClick={setToggleDeleteModal}
            kind={ButtonKind.tertiary}
          >
            Cancel
          </ModalButton>
          <ModalButton onClick={handleDeleteFeedback}>Confirm</ModalButton>
        </ModalFooter>
      </Modal>
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

export default EditFeedbackPage
