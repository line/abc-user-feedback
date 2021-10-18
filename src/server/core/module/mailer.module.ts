import { MailerModule } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'

export default MailerModule.forRootAsync({
  useFactory: async (configService: ConfigService) => {
    const [_, mailSender] = configService.get<string>('app.domain').split('://')

    return {
      transport: {
        host: configService.get<string>('smtp.host'),
        port: configService.get<string>('smtp.port'),
        tls: {
          ciphers: 'SSLv3'
        },
        secure: false, // true for 465, false for other ports
        auth: {
          user: configService.get<string>('smtp.username'),
          pass: configService.get<string>('smtp.password')
        }
      },
      defaults: {
        from: `"User feedback" <noreply@${mailSender?.replace('/', '')}>` // outgoing email ID
      },
      template: {
        dir: process.cwd() + '/template/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }
    }
  },
  inject: [ConfigService]
})
