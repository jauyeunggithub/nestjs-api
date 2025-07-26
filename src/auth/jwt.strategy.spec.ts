import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('should validate and return payload', async () => {
    const payload = { sub: 1, username: 'test' };
    const result = await strategy.validate(payload);
    expect(result).toEqual({ userId: 1, username: 'test' });
  });
});
