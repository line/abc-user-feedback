/* */
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

/* */
import { Post } from '#/core/entity'

@Injectable()
export class PostService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>
  ) {}

  async findAll(offset: number, limit: number): Promise<Array<Post>> {
    const posts = await this.postRepository.find({
      skip: offset,
      take: limit
    })

    return posts
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne(id)

    return post
  }
}
