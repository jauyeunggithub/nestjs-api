import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { Image } from './entities/image.entity';
import { Comment } from './entities/comment.entity';

@Injectable()
export class PolymorphicService {
  constructor(
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Image) private imageRepo: Repository<Image>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
  ) {}

  async createPost(title: string): Promise<Post> {
    const post = this.postRepo.create({ title });
    return this.postRepo.save(post);
  }

  async createImage(url: string): Promise<Image> {
    const image = this.imageRepo.create({ url });
    return this.imageRepo.save(image);
  }

  async createComment(
    content: string,
    relatedType: 'post' | 'image',
    relatedId: number,
  ): Promise<Comment> {
    // Verify related entity exists
    if (relatedType === 'post') {
      const post = await this.postRepo.findOne({ where: { id: relatedId } });
      if (!post) throw new NotFoundException('Post not found');
    } else if (relatedType === 'image') {
      const image = await this.imageRepo.findOne({ where: { id: relatedId } });
      if (!image) throw new NotFoundException('Image not found');
    } else {
      throw new NotFoundException('Invalid related type');
    }

    const comment = this.commentRepo.create({
      content,
      relatedType,
      relatedId,
    });
    return this.commentRepo.save(comment);
  }

  async findCommentsByPost(postId: number): Promise<Comment[]> {
    return this.commentRepo.find({
      where: { relatedType: 'post', relatedId: postId },
    });
  }

  async findCommentsByImage(imageId: number): Promise<Comment[]> {
    return this.commentRepo.find({
      where: { relatedType: 'image', relatedId: imageId },
    });
  }
}
