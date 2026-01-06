import { describe, it, expect } from 'vitest';
import { hashPassword, comparePassword } from '../../src/utils/passwordHash.js';

describe('passwordHash utils', () => {
  it('hashPassword should return a hash and comparePassword validates it', async () => {
    const plain = 'mySecret123';
    const hash = await hashPassword(plain);

    expect(typeof hash).toBe('string');
    expect(hash).not.toBe(plain);

    const valid = await comparePassword(plain, hash);
    expect(valid).toBe(true);

    const invalid = await comparePassword('wrongPassword', hash);
    expect(invalid).toBe(false);
  });

  it('comparePassword returns false for malformed hash', async () => {
    const result = await comparePassword('abc', 'not-a-valid-hash');
    expect(result).toBe(false);
  });
});
