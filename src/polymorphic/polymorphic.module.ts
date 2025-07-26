import { Module } from '@nestjs/common';
import { PolymorphicController } from './polymorphic.controller';
import { PolymorphicService } from './polymorphic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Image } from './entities/image.entity';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Image, Comment])],
  controllers: [PolymorphicController],
  providers: [PolymorphicService],
})
export class PolymorphicModule {}
