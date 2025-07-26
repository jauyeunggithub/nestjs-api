import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PolymorphicService } from './polymorphic.service';
import { PolymorphicController } from './polymorphic.controller';
import { Post } from './entities/post.entity';
import { Image } from './entities/image.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Image, Comment])],
  providers: [PolymorphicService],
  controllers: [PolymorphicController],
})
export class PolymorphicModule {}
