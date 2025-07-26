import { Test, TestingModule } from '@nestjs/testing';
import { PolymorphicController } from './polymorphic.controller';
import { PolymorphicService } from './polymorphic.service';

describe('PolymorphicController', () => {
  let controller: PolymorphicController;
  let service: Partial<PolymorphicService>;

  beforeEach(async () => {
    service = {
      createPost: jest.fn(),
      createImage: jest.fn(),
      createComment: jest.fn(),
      findCommentsByPost: jest.fn(),
      findCommentsByImage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PolymorphicController],
      providers: [{ provide: PolymorphicService, useValue: service }],
    }).compile();

    controller = module.get<PolymorphicController>(PolymorphicController);
  });

  it('should create post', async () => {
    (service.createPost as jest.Mock).mockResolvedValue('post');
    expect(await controller.createPost('title')).toBe('post');
  });

  it('should create image', async () => {
    (service.createImage as jest.Mock).mockResolvedValue('image');
    expect(await controller.createImage('url')).toBe('image');
  });

  it('should create comment', async () => {
    (service.createComment as jest.Mock).mockResolvedValue('comment');
    expect(await controller.createComment('c', 'post', 1)).toBe('comment');
  });

  it('should get post comments', async () => {
    (service.findCommentsByPost as jest.Mock).mockResolvedValue(['comments']);
    expect(await controller.getPostComments(1)).toEqual(['comments']);
  });

  it('should get image comments', async () => {
    (service.findCommentsByImage as jest.Mock).mockResolvedValue(['comments']);
    expect(await controller.getImageComments(1)).toEqual(['comments']);
  });
});
