import { BadRequestException, ValidationPipe } from '@nestjs/common'

const validationPipe = new ValidationPipe({
  // Make sure that there's no unexpected data
  // whitelist: true,
  // forbidNonWhitelisted: true,
  // forbidUnknownValues: true,

  errorHttpStatusCode: 400,

  enableDebugMessages: process.env.NODE_ENV !== 'production',

  /**
   * Detailed error messages since this is 4xx
   */
  // disableErrorMessages: false,

  validationError: {
    /**
     * Avoid exposing the values in the error output (could leak sensitive information)
     */
    // value: true,
    // target: true
  },

  /**
   * Transform the JSON into a class instance when possible.
   * Depends on the type of the data on the controllers
   */
  transform: true,

  stopAtFirstError: true

  // exceptionFactory: (errors) => new BadRequestException(errors)
})

export default validationPipe
