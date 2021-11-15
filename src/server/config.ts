/* */
import { readFileSync } from 'fs'
import * as yaml from 'js-yaml'
import { join } from 'path'
import * as yup from 'yup'
import { InternalServerErrorException } from '@nestjs/common'

/* */
import { AppMode } from '@/types'

const schema = yup.object().shape({
  app: yup.object().shape({
    domain: yup.string().required(),
    mode: yup
      .string()
      .oneOf([AppMode.Modal, AppMode.Page])
      .default(AppMode.Modal),
    useNickname: yup.boolean().default(true),
    useDeleteAccount: yup.boolean().default(true)
  }),
  database: yup.object().shape({
    connectionString: yup.string().required()
  }),
  customAuth: yup.object().shape({
    relayHeader: yup.string(),
    validateUrl: yup.string().url(),
    requestMethod: yup
      .string()
      .oneOf(['get', 'Get', 'GET', 'post', 'Post', 'POST']),
    requestBody: yup.string(),
    responseUserIdField: yup.string()
  }),
  jwt: yup.object().shape({
    secret: yup.string().required('Set JWT secret'),
    accessToken: yup.string().default('USFD_TOKEN'),
    refreshToken: yup.string().default('USFD_RF')
  }),
  smtp: yup.object().shape({
    host: yup.string().required(),
    username: yup.string(),
    password: yup.string(),
    port: yup.number()
  }),
  oauth: yup.object().shape({
    google: yup.object().shape({
      clientId: yup.string(),
      clientSecret: yup.string()
    }),
    line: yup.object().shape({
      clientId: yup.string(),
      clientSecret: yup.string()
    })
  })
})

export default async () => {
  const config = yaml.load(
    readFileSync(join(process.cwd(), 'config.yaml'), 'utf8')
  )

  if (!config) {
    throw new Error('cannot find config.yaml')
  }

  try {
    const validConfig = await schema.validate(config)
    return validConfig
  } catch (err) {
    throw new InternalServerErrorException(
      `wrong configutaion: ${err.toString()}`
    )
  }
}
