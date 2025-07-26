import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findByUsername: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(() => 'token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate user correctly', async () => {
    const user = {
      username: 'test',
      validatePassword: jest.fn(() => Promise.resolve(true)),
    };
    (usersService.findByUsername as jest.Mock).mockResolvedValue(user);

    const result = await service.validateUser('test', 'pass');
    expect(result).toEqual(user);
  });

  it('should return null on invalid password', async () => {
    const user = {
      username: 'test',
      validatePassword: jest.fn(() => Promise.resolve(false)),
    };
    (usersService.findByUsername as jest.Mock).mockResolvedValue(user);

    const result = await service.validateUser('test', 'wrong');
    expect(result).toBeNull();
  });

  it('should return access token on login', async () => {
    const user = { username: 'test', id: 1 };
    const token = await service.login(user);
    expect(token).toEqual({ access_token: 'token' });
    expect(jwtService.sign).toHaveBeenCalledWith({ username: 'test', sub: 1 });
  });
});
