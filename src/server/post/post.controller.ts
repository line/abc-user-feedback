/* */
import { Controller, Get, Param, Query, Res } from '@nestjs/common'
import { Response } from 'express'

/* */
import { PaginationParams } from '#/core/params'
import { PostService } from './post.service'

@Controller('api/v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  async findAll(@Res() res: Response, @Query() pagination: PaginationParams) {
    const { offset, limit } = pagination
    const data = await this.postService.findAll(offset, limit)
    return res.send(data)
  }

  @Get(':id')
  async findOne(@Res() res: Response, @Param('id') postId: string) {
    const data = await this.postService.findOne(postId)
    return res.send(data)
  }
}
