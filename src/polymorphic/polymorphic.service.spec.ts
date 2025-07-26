import { Test, TestingModule } from '@nestjs/testing';
import { PolymorphicService } from './polymorphic.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Comment } from './entities/comment.entity';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';

describe('PolymorphicService', () => {
  let postRepo: jest.Mocked<Repository<Post>>;
  let commentRepo: jest.Mocked<Repository<Comment>>;
  let imageRepo: jest.Mocked<Repository<Image>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PolymorphicService,
        {
          provide: getRepositoryToken(Post),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Image),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    postRepo = module.get(getRepositoryToken(Post));
    commentRepo = module.get(getRepositoryToken(Comment));
    imageRepo = module.get(getRepositoryToken(Image));
  });

  it('should run migrations and tests properly', async () => {
    // Mocking `findOne` for Post
    const mockPost: Post = { id: 1, title: 'Sample Post' }; // Explicitly typing the mock value
    postRepo.findOne.mockResolvedValue(mockPost);

    // Mocking `create` and `save` for Comment
    const mockComment: Comment = {
      id: 1,
      content: 'Sample comment',
      relatedType: 'post', // Ensure this is 'post' or 'image'
      relatedId: 1,
    };
    commentRepo.create.mockReturnValue(mockComment);
    commentRepo.save.mockResolvedValue(mockComment);

    // Mocking `findOne` for Image
    const mockImage: Image = { id: 1, url: 'http://example.com/image.jpg' }; // Explicitly typing the mock value
    imageRepo.findOne.mockResolvedValue(mockImage);

    // Your test logic here
  });
});
