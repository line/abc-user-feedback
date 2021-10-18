/* */
import React, { useMemo } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/router'
import { useSnackbar } from 'baseui/snackbar'
import { Check } from 'baseui/icon'

/* */
import styles from './styles.module.scss'
import { FeedbackForm, Button } from '~/components'
import { AdminPageContainer } from '~/containers'
import { createFeedback } from '~/service/feedback'
import { parseValidateError } from '~/utils/error'

const CreateFeedbackPage = () => {
  const methods = useForm({
    defaultValues: {
      title: '',
      allowAnonymous: true,
      fields: []
    }
  })
  const { enqueue } = useSnackbar()

  const router = useRouter()

  const { formState, getValues, trigger, setError } = methods
  const { isDirty } = formState

  const handleClickCancel = async () => {
    let flag = false
    if (!isDirty) {
      flag = true
    } else {
      if (confirm('cancel create feedback?')) {
        flag = true
      }
    }

    if (flag) {
      await router.push('/admin/feedback')
    }
  }

  const handleSubmitFeedback = async () => {
    if (confirm('create feedback?')) {
      try {
        const result = await trigger()

        if (result) {
          const values = getValues()

          await createFeedback({
            ...values,
            fields: values.fields.map((field, idx) => ({
              ...field,
              order: idx,
              option:
                (field?.option ?? '')
                  .split('\n')
                  .filter((s) => s)
                  .map((s) => s.trim()) ?? []
            }))
          })

          enqueue({
            message: 'Sucess create feedback',
            startEnhancer: ({ size }) => <Check size={size} />
          })
          await router.back()
        }
      } catch (e) {
        const { original } = parseValidateError(e)

        setError('fields', {
          type: 'manual',
          message: original
        })
      }
    }
  }

  const renderTitle = useMemo(() => {
    return (
      <div className={styles.title}>
        <span>Create Feedback</span>
        <div className={styles.title__action}>
          <Button className={styles.title__action} onClick={handleClickCancel}>
            Cancel
          </Button>
          <Button
            className={styles.title__action__create}
            type='primary'
            disabled={!isDirty}
            onClick={handleSubmitFeedback}
          >
            Create
          </Button>
        </div>
      </div>
    )
  }, [isDirty])

  return (
    <AdminPageContainer title={renderTitle} className={styles.container}>
      <div className={styles.page}>
        <FormProvider {...methods}>
          <FeedbackForm />
        </FormProvider>
      </div>
    </AdminPageContainer>
  )
}

export default CreateFeedbackPage
