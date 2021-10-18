import { Controller, Get, Render } from '@nestjs/common'

@Controller()
export class AppController {
  @Get()
  @Render('Main')
  public index() {
    return {
      title: 'Next with Nest'
    }
  }
}
