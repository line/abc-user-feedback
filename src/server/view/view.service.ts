/* */
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

/* */
import { ClientConfig, LoginProvider } from '@/types'

@Injectable()
export class ViewService {
  constructor(private readonly configService: ConfigService) {}

  getViewPath(_path: string): string {
    const path = _path.replace(/^\/|\/$/g, '').trim()

    if (path === '') {
      return 'index'
    }

    return path
  }

  getClientConfig(): ClientConfig {
    const config = {
      email: {
        enable: false
      },
      oauth: {
        [LoginProvider.Google]: {
          enable: false
        },
        [LoginProvider.Line]: {
          enable: false
        }
      }
    } as ClientConfig

    if (
      this.configService.get<string>('oauth.google.clientId') &&
      this.configService.get<string>('oauth.google.clientSecret')
    ) {
      config.oauth.google.enable = true
    }

    if (
      this.configService.get<string>('oauth.line.clientId') &&
      this.configService.get<string>('oauth.line.clientSecret')
    ) {
      config.oauth.line.enable = true
    }

    if (this.configService.get<string>('smtp.host')) {
      config.email.enable = true
    }

    return config
  }
}
