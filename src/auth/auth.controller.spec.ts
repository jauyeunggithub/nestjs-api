import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    authService = {
      validateUser: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should login successfully', async () => {
    (authService.validateUser as jest.Mock).mockResolvedValue({
      username: 'test',
    });
    (authService.login as jest.Mock).mockReturnValue({ access_token: 'token' });

    const result = await controller.login({
      username: 'test',
      password: 'pass',
    });
    expect(result).toEqual({ access_token: 'token' });
  });

  it('should throw UnauthorizedException on invalid credentials', async () => {
    (authService.validateUser as jest.Mock).mockResolvedValue(null);

    await expect(
      controller.login({ username: 'test', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
