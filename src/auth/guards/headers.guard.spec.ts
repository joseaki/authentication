import { HeadersAuthGuard } from './headers.guard';

describe('HeadersAuthGuard', () => {
  it('should be defined', () => {
    expect(new HeadersAuthGuard()).toBeDefined();
  });
});
