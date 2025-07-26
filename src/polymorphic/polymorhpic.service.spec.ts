import { Test, TestingModule } from '@nestjs/testing';
import { PolymorphicService } from './polymorphic.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Image } from './entities/image.entity';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('PolymorphicService', () => {
  let service: PolymorphicService;
  let postRepo: jest.Mocked<Repository<Post>>;
  let imageRepo: jest.Mocked<Repository<Image>>;
  let commentRepo: jest.Mocked<Repository<Comment>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PolymorphicService,
        { provide: getRepositoryToken(Post), useClass: Repository },
        { provide: getRepositoryToken(Image), useClass: Repository },
        { provide: getRepositoryToken(Comment), useClass: Repository },
      ],
    }).compile();

    service = module.get<PolymorphicService>(PolymorphicService);
    postRepo = module.get(getRepositoryToken(Post));
    imageRepo = module.get(getRepositoryToken(Image));
    commentRepo = module.get(getRepositoryToken(Comment));

    // Mock repository methods
    postRepo.findOne = jest.fn();
    postRepo.create = jest.fn();
    postRepo.save = jest.fn();

    imageRepo.findOne = jest.fn();
    imageRepo.create = jest.fn();
    imageRepo.save = jest.fn();

    commentRepo.create = jest.fn();
    commentRepo.save = jest.fn();
    commentRepo.find = jest.fn();
  });

  it('should create post', async () => {
    const post = { id: 1, title: 'title' };
    postRepo.create.mockReturnValue(post);
    postRepo.save.mockResolvedValue(post);

    expect(await service.createPost('title')).toEqual(post);
    expect(postRepo.create).toHaveBeenCalledWith({ title: 'title' });
  });

  it('should create image', async () => {
    const image = { id: 1, url: 'url' };
    imageRepo.create.mockReturnValue(image);
    imageRepo.save.mockResolvedValue(image);

    expect(await service.createImage('url')).toEqual(image);
    expect(imageRepo.create).toHaveBeenCalledWith({ url: 'url' });
  });

  it('should create comment for post', async () => {
    postRepo.findOne.mockResolvedValue({ id: 1 });
    const comment = { id: 1, content: 'c', relatedType: 'post', relatedId: 1 };
    commentRepo.create.mockReturnValue(comment);
    commentRepo.save.mockResolvedValue(comment);

    expect(await service.createComment('c', 'post', 1)).toEqual(comment);
  });

  it('should throw if related post not found', async () => {
    postRepo.findOne.mockResolvedValue(null);
    await expect(service.createComment('c', 'post', 1)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create comment for image', async () => {
    imageRepo.findOne.mockResolvedValue({ id: 1 });
    const comment = { id: 1, content: 'c', relatedType: 'image', relatedId: 1 };
    commentRepo.create.mockReturnValue(comment);
    commentRepo.save.mockResolvedValue(comment);

    expect(await service.createComment('c', 'image', 1)).toEqual(comment);
  });

  it('should throw if related image not found', async () => {
    imageRepo.findOne.mockResolvedValue(null);
    await expect(service.createComment('c', 'image', 1)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw on invalid relatedType', async () => {
    await expect(
      service.createComment('c', 'invalid' as any, 1),
    ).rejects.toThrow(NotFoundException);
  });

  it('should find comments by post', async () => {
    commentRepo.find.mockResolvedValue([{ id: 1 } as any]);
    const comments = await service.findCommentsByPost(1);
    expect(commentRepo.find).toHaveBeenCalledWith({
      where: { relatedType: 'post', relatedId: 1 },
    });
    expect(comments).toEqual([{ id: 1 }]);
  });

  it('should find comments by image', async () => {
    commentRepo.find.mockResolvedValue([{ id: 1 } as any]);
    const comments = await service.findCommentsByImage(1);
    expect(commentRepo.find).toHaveBeenCalledWith({
      where: { relatedType: 'image', relatedId: 1 },
    });
    expect(comments).toEqual([{ id: 1 }]);
  });
});
