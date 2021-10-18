/* */
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

/* */
import { PostService } from './post.service'
import { PostController } from './post.controller'
import { Post } from '#/core/entity'

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
