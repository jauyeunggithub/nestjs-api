import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PolymorphicService } from './polymorphic.service';

@Controller('polymorphic')
export class PolymorphicController {
  constructor(private polyService: PolymorphicService) {}

  @Post('posts')
  createPost(@Body('title') title: string) {
    return this.polyService.createPost(title);
  }

  @Post('images')
  createImage(@Body('url') url: string) {
    return this.polyService.createImage(url);
  }

  @Post('comments')
  createComment(
    @Body('content') content: string,
    @Body('relatedType') relatedType: 'post' | 'image',
    @Body('relatedId') relatedId: number,
  ) {
    return this.polyService.createComment(content, relatedType, relatedId);
  }

  @Get('posts/:id/comments')
  getPostComments(@Param('id') id: number) {
    return this.polyService.findCommentsByPost(+id);
  }

  @Get('images/:id/comments')
  getImageComments(@Param('id') id: number) {
    return this.polyService.findCommentsByImage(+id);
  }
}
