import { RenderModule } from 'nest-next'
import Next from 'next'
import { resolve } from 'path'

const isProduction = process.env.NODE_ENV === 'production'

export default RenderModule.forRootAsync(
  Next({
    dev: !isProduction,
    dir: isProduction
      ? resolve(__dirname, '../../../..')
      : resolve(__dirname, '../../../../src/client')
    // conf: {
    //   i18n: {
    //     defaultLocale: 'en',
    //     locales: ['en', 'ja'],
    //     localeExtension: 'json',
    //     localPath: process.cwd() + 'src/client/public/locale'
    //   }
    // }
  }),
  {
    passthrough404: true,
    viewsDir: null
  }
)
